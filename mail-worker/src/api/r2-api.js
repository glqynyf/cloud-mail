import r2Service from '../service/r2-service';
import app from '../hono/hono';

app.get('/oss/*', async (c) => {
	const key = c.req.path.split('/oss/')[1];
	const obj = await r2Service.getObj(c, key);

	if (!obj) {
		return new Response('Not Found', { status: 404 });
	}

	// KV 分支返回的已经是完整 Response,不能再包一层(否则 body 为空)
	if (obj instanceof Response) {
		return obj;
	}

	return new Response(obj.body, {
		headers: {
			'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
			'Content-Disposition': obj.httpMetadata?.contentDisposition || null
		}
	});
});


