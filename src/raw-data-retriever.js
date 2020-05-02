import fs from "fs";
import path from "path";

let instance = null;

class rawDataRetriever{

    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    };

    async retrieveCurrentTime() {
        return new Date().toISOString().split("T")[1].split('.')[0];
    };

    async retrieveForbiddenPeriods() {
        return new Promise((resolve, reject) => {
            fs.readFile(`${path.dirname(__dirname)}/files/forbidden_periods.json`, (err, data) => {
                if (err) {
                    reject(`Error retrieving forbidden periods ${err.message}`);
                }
                try {
                    const forbiddenPeriodsJSON = JSON.parse(data.toString());

                    Object.values(forbiddenPeriodsJSON).forEach((forbiddenPeriods) => {
                        const resultForbiddenPeriods = forbiddenPeriods.map((forbiddenPeriod) => {
                            const interval = forbiddenPeriod.split(`/`);
                            return {'begin': interval[0], 'end': interval[1]};
                        }, []);

                        resolve(resultForbiddenPeriods);

                    });

                } catch (error) {
                    reject(`Error retrieving forbidden periods: ${error.message}`)
                }
            });
        });
    };

}

export default rawDataRetriever;
