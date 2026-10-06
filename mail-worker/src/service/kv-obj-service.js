const kvObjService = {

	async putObj(c, key, content, metadata) {
		await c.env.kv.put(key, content, { metadata: metadata });
	},

	async deleteObj(c, keys) {

		if (typeof keys === 'string') {
			keys = [keys];
		}

		if (keys.length === 0) {
			return;
		}

		await Promise.all(keys.map( key => c.env.kv.delete(key)));
	},

	async getObj(c, key) {
		const obj = await c.env.kv.getWithMetadata(key, { type: "arrayBuffer"});
		if (!obj?.value) {
			return new Response('Not Found', {
				status: 404,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' }
			});
		}

		const headers = {
			'Content-Type': obj.metadata?.contentType || 'application/octet-stream'
		};

		if (obj.metadata?.contentDisposition) {
			headers['Content-Disposition'] = obj.metadata.contentDisposition;
		}

		if (obj.metadata?.cacheControl) {
			headers['Cache-Control'] = obj.metadata.cacheControl;
		}

		return new Response(obj.value, { headers });
	},

	async toObjResp(c, key) {

		return await this.getObj(c, key);

	}

};

export default kvObjService;
