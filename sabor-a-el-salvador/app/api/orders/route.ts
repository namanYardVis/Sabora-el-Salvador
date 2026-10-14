import {env} from 'cloudflare:workers';
import {menu,toppings} from '../../../lib/menu';
export async function POST(request:Request){
 const e=env as unknown as Record<string,any>;
 const fail=(error:string,status=400)=>Response.json({error},{status});
 if(request.headers.get('origin')!==new URL(request.url).origin)return fail('Origin',403);
 if(!e.OWNER_EMAIL||!e.RESEND_API_KEY||!e.RESEND_FROM||!e.TWILIO_ACCOUNT_SID||!e.TWILIO_AUTH_TOKEN||!e.TWILIO_FROM)return fail('Notifications are not configured. Please use WhatsApp or call.',503);
 let body:any;try{const raw=await request.text();if(raw.length>20000)return fail('Too large',413);body=JSON.parse(raw)}catch{return fail('Invalid request')}
 const {form,cart,key,lang}=body;
 if(!form||form.website||!Array.isArray(cart)||!cart.length||cart.length>7||typeof key!=='string'||!/^[-a-zA-Z0-9]{20,60}$/.test(key))return fail('Invalid order');
 if(typeof form.name!=='string'||!form.name.trim()||form.name.length>100||typeof form.phone!=='string'||form.phone.replace(/\D/g,'').length!==10||!['pickup','delivery'].includes(form.method)||!['call','text','whatsapp'].includes(form.contact)||String(form.notes).length>1000)return fail('Check contact information');
 if(form.method==='delivery'&&(!form.street?.trim()||!form.city?.trim()||!/^\d{5}$/.test(form.zip)))return fail('Check address');
 const lines=[];let subtotal=0;
 for(const line of cart){const item=menu.find(x=>x.id===line.id);if(!item||!item.available||!Number.isInteger(line.qty)||line.qty<1||line.qty>99||(item.id==='bananos'&&(!Number.isInteger(line.top)||line.top<0||line.top>4)))return fail('Invalid item');subtotal+=item.price*line.qty;lines.push(`${line.qty} × ${item.name}${item.id==='bananos'?' ('+toppings[line.top][0]+')':''} · $${(item.price*line.qty).toFixed(2)}`)}
 const db=e.DB;const existing=await db.prepare('SELECT id,notified FROM orders WHERE request_key=?').bind(key).first();if(existing)return Response.json({number:'SAS-'+(1000+existing.id),notified:!!existing.notified});
 const recent=await db.prepare('SELECT count(*) as n FROM orders WHERE phone=? AND created_at>?').bind(form.phone.replace(/\D/g,''),new Date(Date.now()-300000).toISOString()).first();if(recent.n>=3)return fail('Please wait before trying again',429);
 const now=new Date().toISOString();const row=await db.prepare('INSERT INTO orders (request_key,created_at,phone,payload,status,notified) VALUES (?,?,?,?,?,?) RETURNING id').bind(key,now,form.phone.replace(/\D/g,''),JSON.stringify({...body,subtotal}),'Nuevo',0).first();const number='SAS-'+(1000+row.id);
 const text=`NUEVO PEDIDO #${number}\n${now}\n${form.method==='pickup'?'Recoger':'Envío'} · Horario por confirmar\n${form.name} · ${form.phone}\nContacto: ${form.contact} · Idioma: ${lang}\n${form.method==='delivery'?form.street+' '+form.apt+', '+form.city+' '+form.zip:''}\n${lines.join('\n')}\nSubtotal: $${subtotal.toFixed(2)} + envío si aplica\nNotas: ${form.notes}`;
 const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
 const html=`<pre>${escape(text)}</pre><p><a href="tel:+1${form.phone.replace(/\D/g,'')}">Llamar al cliente</a> · <a href="https://wa.me/1${form.phone.replace(/\D/g,'')}">WhatsApp al cliente</a></p>${form.method==='delivery'?`<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.street+', '+form.city+' '+form.zip)}">Dirección de entrega</a>`:''}`;
 const results=await Promise.allSettled([fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+e.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify({from:e.RESEND_FROM,to:[e.OWNER_EMAIL],subject:`NUEVO PEDIDO #${number} · ${form.method==='pickup'?'Recoger':'Envío'} · ${form.name}`,text,html})}),fetch(`https://api.twilio.com/2010-04-01/Accounts/${e.TWILIO_ACCOUNT_SID}/Messages.json`,{method:'POST',headers:{Authorization:'Basic '+btoa(e.TWILIO_ACCOUNT_SID+':'+e.TWILIO_AUTH_TOKEN),'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({To:e.OWNER_PHONE||'+17753609200',From:e.TWILIO_FROM,Body:text.slice(0,1500)})})]);
 const notified=results.every(r=>r.status==='fulfilled'&&r.value.ok);await db.prepare('UPDATE orders SET notified=? WHERE id=?').bind(notified?1:0,row.id).run();return Response.json({number,notified});
}
