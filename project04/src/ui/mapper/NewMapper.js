import NewViewModel from "../viewmodel/NewViewModel.js";

export default class NewMapper {

    static validationToNewViewModel(errors, cache) {
        return new NewViewModel(
            errors,
            cache
        );
    }

}