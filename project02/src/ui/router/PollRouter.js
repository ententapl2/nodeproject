export default class PollRouter {

    #pollService;

    constructor(pollService) {
        this.#pollService = pollService;
        this.getHandler = this.getHandler.bind(this);
        this.postHandler = this.postHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.render = this.render.bind(this);
    }

    render(req, res, pollViewModel) {
        res.render('poll', {
            scripts:[{type:'text/javascript', src:'/scripts/poll.js'}],
            styles:[{src:'/styles/poll.css'}, {src:'/styles/components/gallery.css'}],
            poll:pollViewModel,
            account: {
                id:(req.session.userId ?? null),
                name:(req.session.userName ?? null)
            }
        })
    }

    getHandler(req, res) {
        const userId = req.session.userId;
        const pollId = req.params.pollId;
        if (!pollId) return res.status(404).render('404')
        try {
            const page = (req.query.page ?? 1)
            const poll = this.#pollService.loadPoll(pollId, 10, ((page-1)*10));
            if (!poll) return res.status(404).render('404')

            if (!Object.keys(poll?.votes).length && page !== 1) throw {id:1, message:'No more page'}
            const hasVoted = Object.values(poll.votes).some(varr => varr.some(v => v.user.id === userId));
            const isEnd = Object.entries(poll.votes ?? {}).length <= 10;
            this.render(req, res, {
                id:poll.id,
                question:poll.question,
                description:poll.description,
                authorId:poll.author.id,
                authorName:poll.author.name,
                publicationDate:poll.publicationDate,
                options: poll.options.map(o => ({ ...o, voteCount: Number((((poll.votes[o.id]?.length ?? 0) / Object.values(poll.votes).flat().length) * 100).toFixed(2)) })),
                hasVoted,
                votes:  Object.entries(poll.votes).flatMap(
                    ([optionId, votes], optionIndex) => 
                        votes.map(vote => ({
                        userId: vote.user.id,
                        userName: vote.user.name,
                        option: optionIndex + 1,
                        optionId: Number(optionId) 
                        }))
                    ),
                details:{
                    isAuthor:(req.session.userId === poll.author.id),
                    page:page,
                    isEnd:isEnd
                }
            })
        } catch (e) {
            if (e?.type === 1) {res.status(404).render('404')}
            else { res.status(500).render('500'); }
        }
    }

    async postHandler(req, res) {
        const pollId = req.params.pollId;
        const optionId = req.body.option;
        const userId = req.session.userId;

        if (!userId) return res.redirect('/login');
        else if (!pollId || !optionId) return res.status(401).render('401');
        else {
            try {
                this.#pollService.assignVoteToPoll(pollId, userId, optionId);
                res.redirect(`/poll/${pollId}`);
            } catch (e) {
                res.status(406).render('404')
            }
        }

    }

    deleteHandler(req, res) {
        const pollId = req.params.pollId;
        const userId = req.session.userId;
        try {
            const poll = this.#pollService.loadPoll(pollId);
            if (!poll) {res.stauts(404).send('Nie znaleziono ankiety')}
            else if (poll.author.id === userId) {
                this.#pollService.deletePoll(pollId);
                res.status(202).send('Sukces')
            }
            else {
                res.status(401).render('401')
            }
        } catch (e) {
            res.status(500).render('500')
        }

    }

}