function newContest(contest) {
    return new Promise((resolve, reject) => {
        contest.save((err, savedContest) => {
            if (err) reject({ ok: false, status: 500, errors: err });
            resolve({ ok: true, contest: savedContest })
        });
    });
}

module.exports = {
    newContest
};