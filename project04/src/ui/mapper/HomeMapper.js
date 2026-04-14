import HomeViewModel, { PollViewModel, UserViewModel, MostActiveUser } from "../viewmodel/HomeViewModel.js";

export default class HomeMapper {

    static userQueryToUserViewModel(user) {
        return new UserViewModel(
            user.id,
            user.name
        );
    }

    static userQueryToMostActiveUserViewModel(user) {
        return new MostActiveUser(
            user.id,
            user.name,
            user.name.charAt(0)
        );
    }

    static pollQueryToPollViewModel(poll) {
        return new PollViewModel(
            poll.id,
            poll.question,
            poll.options
        );
    }

    static homeQueryToViewModel(
        mostPopularPolls,
        recentPolls,
        mostActiveUsers
    ) {
        return new HomeViewModel(
            mostPopularPolls.map(HomeMapper.pollQueryToPollViewModel),
            recentPolls.map(HomeMapper.pollQueryToPollViewModel),
            mostActiveUsers.map(HomeMapper.userQueryToMostActiveUserViewModel)
        );
    }

}