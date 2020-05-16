class TimeReader{
    constructor() {
        this.currentTime = () => new Promise ((resolve, reject) => {
            let currentTime = new Date().toISOString().split("T")[1].split('.')[0];

            if (currentTime) {
                resolve(currentTime) }
            else {
                reject('Error retrieving current time');
            }
        });
    };
}

export default new TimeReader();