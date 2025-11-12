export default class PollSearchRouter {

    constructor() {
        this.getHandler = this.getHandler.bind(this);
        this.render = this.render.bind(this);
    }

    render(req, res) {
        res.render('pollSearch', {
        scripts:[{type:'text/javascript', src:'/scripts/home.js'}],
        styles:[{src:'/styles/pollSearch.css'}, {src:'/styles/components/gallery.css'}],
        account: {
            id:(req.session.userId ?? null),
            name:(req.session.userName ?? null)
        } 
        });
    }

    getHandler(req, res) {
        this.render(req, res);
    }

} 