import { config } from '../config';

interface IAPIError {
    status: number,
    ok: boolean,
    statusText: string,
    body: any,
    url: string
}

export default class Service {
    protected _service_url: string = config.API_URL;

    protected api<T>(url: string, args: any, _headers?: any, ignoreContentType: boolean = false): Promise<T> {

        let headers: any = (_headers)? _headers : {}
        if (!headers['Content-Type'] && ignoreContentType === false) headers['Content-Type'] = 'application/json';
        if (localStorage.getItem('token')) headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        Object.assign(args, {
            headers: headers
        });

        return (
            fetch(this._service_url + url, args)
                .then( resp => {
                    if (resp.status === 200) {
                        return Promise.resolve(resp.json());
                    }
                    return Promise.reject(resp);
                })
                .catch ((error: IAPIError) => {
                    return Promise.reject(error);
                })
        )
    };

    protected _get<T>(url: string, content?: any): Promise<T> {
        return this.api(url, {});
    }

    protected _post<T>(url: string, content: any): Promise<T> {
        return this.api(url, {
            method: 'POST',
            body: JSON.stringify(content)
        })
    }

    protected formPost<T>(url: string, content: FormData): Promise<T> {
        return this.api(url, {
            method: 'POST',
            body: content
        }, {}, true)
    }

    protected _patch<T>(url: string, content: any): Promise<T> {
        return this.api(url, {
            method: 'PATCH',
            body: JSON.stringify(content)
        })
    }

    protected _put<T>(url: string, content: any): Promise<T> {
        return this.api(url, {
            method: 'PUT',
            body: JSON.stringify(content)
        })
    }

    protected _delete<T>(url: string): Promise<T> {
        return this.api(url, {method: 'DELETE'})
    }

}