import LoginViewModel from "../viewmodel/LoginViewModel.js";

export default class LoginMapper {

    static validationToLoginViewModel(errors, cache) {
        return new LoginViewModel(
            errors,
            cache
        )
    }

}