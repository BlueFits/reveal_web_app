export default class PickupLines {
    private static copy = [
        "If you were a Transformer… you’d be Optimus Fine.",
        "I wish I were cross-eyed so I can see you twice.",
        "Well, here I am. What are your other two wishes?",
        "Are you French? Because Eiffel for you.",
        "Do you like raisins? How do you feel about a date?",
    ];

    static random() {
        return this.copy[Math.floor(Math.random() * this.copy.length)];
    }
}