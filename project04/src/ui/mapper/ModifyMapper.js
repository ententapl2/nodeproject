import ModifyViewModel from "../viewmodel/ModifyViewModel.js";

export default class ModifyMapper {

    static validationToModifyViewModel(errors, cache, pollId) {
        return new ModifyViewModel(
            errors,
            cache,
            pollId
        );
    }

    static pollQueryToCache(pollQuery) {
        return {
            question: pollQuery.question,
            description: pollQuery.description,
            options: pollQuery.options
        };
    }

}