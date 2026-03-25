import ErrorViewModel from "../viewmodel/ErrorViewModel.js";

export default class ErrorRouter {

    static defaultStatus = 500;
    static allowedStatus = {
        400: 'Nieprawidłowe żądanie',
        401: 'Brak dostępu',
        403: 'Zablokowany dostęp',
        404: 'Nie znaleziono',
        405: 'Nieprawidłowa metoda',
        500: 'Błąd serwera'
    };

    constructor() {
        this.getHandler = this.getHandler.bind(this);
        this.notFoundHandler = this.notFoundHandler.bind(this);
        this.render = this.render.bind(this);
    }

    render(req, res, errorViewModel) {
        res.status(errorViewModel.code).render(
            'error', {
                account:{
                    id:(req.session?.userId ?? null),
                    name:(req.session?.userName ?? null)
                },
                errorViewModel,
                scripts:[],
                styles:[{src:'/styles/errors.css'}]
            }
        );
    }

    getHandler(err, req, res, next) {        
        err = err.code === 'EBADCSRFTOKEN' ? 403 : err;
        const status = err in ErrorRouter.allowedStatus ? err : ErrorRouter.defaultStatus;
        const message = ErrorRouter.allowedStatus[status];
        const errorViewModel = new ErrorViewModel(message,status);
        this.render(req, res, errorViewModel);
    }

    notFoundHandler(req, res, next) {
        this.getHandler(404, req, res, next);
    }

}