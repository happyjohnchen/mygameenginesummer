export function randomName(): string {
    const arrName = ["Tom", "Jerry", "Sam", "Taylor", "Jones", "Chris", "Kelly", "Lane", "Tommy", "Terry",
        "Vivian", "Nancy", "Emma", "Elvis", "Carl", "Albert", "Harvey", "Liam", "James", "Bruce"];
    return arrName[Math.floor((Math.random() * this.arrSpecies.length))];
}

export function randomRace(): number {
    return Math.floor(Math.random() * 4);
}