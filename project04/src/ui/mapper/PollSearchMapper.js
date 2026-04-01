import { PollViewModel } from "../viewmodel/HomeViewModel.js";
import PollSearchViewModel from "../viewmodel/PollSearchViewModel.js";

export default class PollSearchMapper {

    static pollQueryToPollViewModel(poll) {
        return new PollViewModel(
            poll.id,
            poll.question,
            poll.options
        )
    }

    static pollSearchQueryToViewModel(polls, phrase, page, limit) {
        return new PollSearchViewModel(
            polls.map(PollSearchMapper.pollQueryToPollViewModel).slice(0, limit), 
            phrase,
            page,
            polls.length <= limit
        );
    }

}
