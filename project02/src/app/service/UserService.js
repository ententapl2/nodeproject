export default class UserService {

    #userQueryRepo;

    constructor(userQueryRepo) {
        this.#userQueryRepo = userQueryRepo;
    }

    loadDashobardSummaries() {
        const users = this.#userQueryRepo.getUsersByMostPolls()
        return users
    }

    loadStats(userId) {
        const userStats = this.#userQueryRepo.getUserStatsQuery(userId);
        return userStats;
    }

}