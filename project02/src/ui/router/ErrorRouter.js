export default class ErrorRouter {

    render404(req, res) {
        res.status(404).render('404', {
            scripts:[],
            styles:[{src:'/styles/errors.css'}]
        });
    }

    render500(req, res) {
        res.status(500).render('500', {
            scripts:[],
            styles:[{src:'/styles/errors.css'}]
        });
    }

    render401(req, res) {
        res.status(401).render('401', {
            scripts:[],
            styles:[{src:'/styles/errors.css'}]
        });
    }

    render406(req, res) {
        res.status(406).render('404', {
            scripts:[],
            styles:[{src:'/styles/errors.css'}]
        });
    }

}