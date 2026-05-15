export default class BaseRouter {

    _template;
    _scripts;
    _styles;
    _includeCSRF;

    constructor(template, scripts, styles, includeCSRF=false) {
        this._template = template;
        this._scripts = scripts;
        this._styles = styles;
        this._includeCSRF =  includeCSRF;

        this.render = this.render.bind(this);
    }

    render(req, res, viewModel) {
        res.render(this._template, {
            account: {
                id: req.session.userId, 
                name: req.session.userName,
                csrf: (this._includeCSRF ? req.csrfToken() : undefined)
            },
            viewModel: viewModel, 
            scripts: this._scripts,
            styles: this._styles
        });
    }

}

export class ExternalScript {

    #src;
    #type;

    constructor(src, type) {
        this.#src = src;
        this.#type = type;
    }

    get src() {
        return this.#src;
    }

    get type() {
        return this.#type;
    }

}