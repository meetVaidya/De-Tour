interface Sidequest {
    hiddengem: string;
    description: string;
}

interface Day {
    Morning: string[];
    Afternoon: string[];
    Evening: string[];
    Sidequests: Sidequest[];
}

interface Itinerary {
    [key: string]: Day;
}

interface Data {
    currentStay: string;
    dateOfVisit: string;
    daysOfVisit: string;
    itinerary: {
        json: {
            itinerary: Itinerary;
        };
    };
    name: string;
    numberOfPeople: string;
    placesToVisit: string[];
}

interface Root {
    data: Data;
    itinerary: {
        json: {
            itinerary: Itinerary;
        };
    };
    name: string;
}

// Example usage:
const jsonString = `{
    "data": {
        "currentStay": "Ghatla",
        "dateOfVisit": "2025-02-22T18:30:00.000Z",
        "daysOfVisit": "3",
        "itinerary": {
            "json": {
                "itinerary": {
                    "Day 1": {
                        "Morning": [
                            "Visit the Statue of St. Sebastian",
                            "Explore the surrounding area and take photographs"
                        ],
                        "Afternoon": [
                            "Lunch at a nearby café offering local cuisine",
                            "Visit Mahiim Fort (माहिम किल्ला) to explore its history"
                        ],
                        "Evening": [
                            "Dinner at a beachfront restaurant",
                            "Stroll along the beach and visit a local night market"
                        ],
                        "Sidequests": [
                            {
                                "hiddengem": "Secret Beach",
                                "description": "A secluded paradise perfect for relaxation and photography."
                            },
                            {
                                "hiddengem": "Local Market",
                                "description": "Handmade crafts & food offerings from local artisans."
                            }
                        ]
                    },
                    "Day 2": {
                        "Morning": [
                            "Yoga session at a nearby park",
                            "Breakfast at a local café known for its pastries"
                        ],
                        "Afternoon": [
                            "Visit a local museum for cultural insights",
                            "Have lunch at a restaurant serving traditional Indian meals"
                        ],
                        "Evening": [
                            "Explore the local nightlife scene, with options for live music",
                            "Attend a cultural event or performance if available"
                        ],
                        "Sidequests": [
                            {
                                "hiddengem": "Hidden Waterfall",
                                "description": "A tranquil spot for nature lovers, accessible after a short hike."
                            },
                            {
                                "hiddengem": "Artisan Workshop",
                                "description": "Learn from local artisans about traditional crafts."
                            }
                        ]
                    },
                    "Day 3": {
                        "Morning": [
                            "Take a cooking class to learn local recipes",
                            "Enjoy a leisurely brunch at a rooftop café"
                        ],
                        "Afternoon": [
                            "Participate in a guided heritage walk in the city",
                            "Lunch at a popular food truck offering street food"
                        ],
                        "Evening": [
                            "Sunset cruise along the coast",
                            "Farewell dinner at a rooftop restaurant with city views"
                        ],
                        "Sidequests": [
                            {
                                "hiddengem": "Vintage Bookstore",
                                "description": "A charming store filled with rare and antique books."
                            },
                            {
                                "hiddengem": "Community Garden",
                                "description": "An urban oasis showcasing local flora and gardening efforts."
                            }
                        ]
                    }
                }
            }
        },
        "name": "Meet",
        "numberOfPeople": "4",
        "placesToVisit": [
            "Statue of St. Sebastian",
            "माहिम किल्ला"
        ]
    },
    "itinerary": {
        "json": {
            "itinerary": {
                "Day 1": {
                    "Morning": [
                        "Visit the Statue of St. Sebastian",
                        "Explore the surrounding area and take photographs"
                    ],
                    "Afternoon": [
                        "Lunch at a nearby café offering local cuisine",
                        "Visit Mahiim Fort (माहिम किल्ला) to explore its history"
                    ],
                    "Evening": [
                        "Dinner at a beachfront restaurant",
                        "Stroll along the beach and visit a local night market"
                    ],
                    "Sidequests": [
                        {
                            "hiddengem": "Secret Beach",
                            "description": "A secluded paradise perfect for relaxation and photography."
                        },
                        {
                            "hiddengem": "Local Market",
                            "description": "Handmade crafts & food offerings from local artisans."
                        }
                    ]
                },
                "Day 2": {
                    "Morning": [
                        "Yoga session at a nearby park",
                        "Breakfast at a local café known for its pastries"
                    ],
                    "Afternoon": [
                        "Visit a local museum for cultural insights",
                        "Have lunch at a restaurant serving traditional Indian meals"
                    ],
                    "Evening": [
                        "Explore the local nightlife scene, with options for live music",
                        "Attend a cultural event or performance if available"
                    ],
                    "Sidequests": [
                        {
                            "hiddengem": "Hidden Waterfall",
                            "description": "A tranquil spot for nature lovers, accessible after a short hike."
                        },
                        {
                            "hiddengem": "Artisan Workshop",
                            "description": "Learn from local artisans about traditional crafts."
                        }
                    ]
                },
                "Day 3": {
                    "Morning": [
                        "Take a cooking class to learn local recipes",
                        "Enjoy a leisurely brunch at a rooftop café"
                    ],
                    "Afternoon": [
                        "Participate in a guided heritage walk in the city",
                        "Lunch at a popular food truck offering street food"
                    ],
                    "Evening": [
                        "Sunset cruise along the coast",
                        "Farewell dinner at a rooftop restaurant with city views"
                    ],
                    "Sidequests": [
                        {
                            "hiddengem": "Vintage Bookstore",
                            "description": "A charming store filled with rare and antique books."
                        },
                        {
                            "hiddengem": "Community Garden",
                            "description": "An urban oasis showcasing local flora and gardening efforts."
                        }
                    ]
                }
            }
        }
    },
    "name": "Meet"
}`;

const parsedData: Root = JSON.parse(jsonString);
console.log(parsedData);

// Accessing nested objects
console.log(parsedData.data.itinerary.json.itinerary["Day 1"].Morning);
console.log(parsedData.data.itinerary.json.itinerary["Day 1"].Sidequests);
