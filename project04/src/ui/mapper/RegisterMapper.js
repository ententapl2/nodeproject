import RegisterViewModel from "../viewmodel/RegisterViewModel.js";

export default class RegisterMapper {

    static validationToRegisterViewModel(errors, cache) {
        return new RegisterViewModel(
            errors,
            cache
        );
    }

}