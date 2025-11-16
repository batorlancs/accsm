use crate::models::{Car, Track};
use std::collections::HashMap;

/// Static data for ACC cars
pub fn get_cars() -> HashMap<String, Car> {
    let mut cars = HashMap::new();

    let car_data = vec![
        (
            "audi_r8_evo",
            "R8 Evo",
            "Audi R8 LMS Evo",
            "Audi",
            "Germany",
            2019,
            "gt3",
        ),
        (
            "audi_r8_evo_ii",
            "R8 Evo II",
            "Audi R8 LMS Evo II",
            "Audi",
            "Germany",
            2022,
            "gt3",
        ),
        (
            "bmw_m4_gt3",
            "M4",
            "BMW M4 GT3",
            "BMW",
            "Germany",
            2021,
            "gt3",
        ),
        (
            "bentley_continental_gt3_2018",
            "Continental",
            "Bentley Continental GT3 2018",
            "Bentley",
            "United Kingdom",
            2018,
            "gt3",
        ),
        (
            "ferrari_488_gt3",
            "488",
            "Ferrari 488 GT3",
            "Ferrari",
            "Italy",
            2016,
            "gt3",
        ),
        (
            "ferrari_488_gt3_evo",
            "488 Evo",
            "Ferrari 488 GT3 Evo",
            "Ferrari",
            "Italy",
            2020,
            "gt3",
        ),
        (
            "lamborghini_huracan_gt3",
            "Huracán",
            "Lamborghini Huracán GT3",
            "Lamborghini",
            "Italy",
            2015,
            "gt3",
        ),
        (
            "lamborghini_huracan_gt3_evo",
            "Huracán Evo",
            "Lamborghini Huracán GT3 Evo",
            "Lamborghini",
            "Italy",
            2019,
            "gt3",
        ),
        (
            "lamborghini_huracan_gt3_evo2",
            "Huracán Evo2",
            "Lamborghini Huracán GT3 Evo2",
            "Lamborghini",
            "Italy",
            2023,
            "gt3",
        ),
        (
            "mclaren_720s_gt3",
            "720S",
            "McLaren 720S GT3",
            "McLaren",
            "United Kingdom",
            2019,
            "gt3",
        ),
        (
            "mercedes_amg_gt3",
            "AMG GT",
            "Mercedes-AMG GT3",
            "Mercedes-AMG",
            "Germany",
            2016,
            "gt3",
        ),
        (
            "mercedes_amg_gt3_evo",
            "AMG GT Evo",
            "Mercedes-AMG GT3 Evo",
            "Mercedes-AMG",
            "Germany",
            2020,
            "gt3",
        ),
        (
            "porsche_991_gt3_r",
            "991 GT3 R",
            "Porsche 991 GT3 R",
            "Porsche",
            "Germany",
            2016,
            "gt3",
        ),
        (
            "porsche_991ii_gt3_r",
            "991.2 GT3 R",
            "Porsche 991.2 GT3 R",
            "Porsche",
            "Germany",
            2019,
            "gt3",
        ),
        (
            "nissan_gt_r_gt3_2018",
            "GT-R Nismo",
            "Nissan GT-R Nismo GT3",
            "Nissan",
            "Japan",
            2018,
            "gt3",
        ),
        (
            "lexus_rc_f_gt3",
            "RC F",
            "Lexus RC F GT3",
            "Lexus",
            "Japan",
            2017,
            "gt3",
        ),
        (
            "honda_nsx_gt3",
            "NSX",
            "Honda NSX GT3",
            "Honda",
            "Japan",
            2017,
            "gt3",
        ),
        (
            "honda_nsx_gt3_evo",
            "NSX Evo",
            "Honda NSX GT3 Evo",
            "Honda",
            "Japan",
            2019,
            "gt3",
        ),
        (
            "alpine_a110_gt4",
            "A110",
            "Alpine A110 GT4",
            "Alpine",
            "France",
            2018,
            "gt4",
        ),
        (
            "aston_martin_vantage_gt4",
            "Vantage",
            "Aston Martin Vantage GT4",
            "Aston Martin",
            "United Kingdom",
            2019,
            "gt4",
        ),
        (
            "bmw_m4_gt4",
            "M4",
            "BMW M4 GT4",
            "BMW",
            "Germany",
            2018,
            "gt4",
        ),
        (
            "chevrolet_camaro_gt4r",
            "Camaro",
            "Chevrolet Camaro GT4.R",
            "Chevrolet",
            "United States",
            2017,
            "gt4",
        ),
        (
            "ginetta_g55_gt4",
            "G55",
            "Ginetta G55 GT4",
            "Ginetta",
            "United Kingdom",
            2017,
            "gt4",
        ),
        (
            "ktm_xbow_gt4",
            "X-Bow",
            "KTM X-Bow GT4",
            "KTM",
            "Austria",
            2016,
            "gt4",
        ),
        (
            "maserati_mc_gt4",
            "MC",
            "Maserati MC GT4",
            "Maserati",
            "Italy",
            2017,
            "gt4",
        ),
        (
            "mclaren_570s_gt4",
            "570S",
            "McLaren 570S GT4",
            "McLaren",
            "United Kingdom",
            2017,
            "gt4",
        ),
        (
            "mercedes_amg_gt4",
            "AMG GT",
            "Mercedes-AMG GT4",
            "Mercedes-AMG",
            "Germany",
            2017,
            "gt4",
        ),
        (
            "porsche_718_cayman_gt4_clubsport",
            "718 Cayman",
            "Porsche 718 Cayman GT4",
            "Porsche",
            "Germany",
            2019,
            "gt4",
        ),
    ];

    for (id, pretty_name, full_name, brand_name, brand_country, year, car_type) in car_data {
        cars.insert(
            id.to_string(),
            Car {
                id: id.to_string(),
                pretty_name: pretty_name.to_string(),
                full_name: full_name.to_string(),
                brand_name: brand_name.to_string(),
                brand_country: brand_country.to_string(),
                year,
                car_type: car_type.to_string(),
            },
        );
    }

    cars
}

/// Static data for ACC tracks
pub fn get_tracks() -> HashMap<String, Track> {
    let mut tracks = HashMap::new();

    let track_data = vec![
        (
            "Barcelona",
            "Barcelona",
            "Circuit de Barcelona-Catalunya",
            "Spain",
        ),
        (
            "brands_hatch",
            "Brands Hatch",
            "Brands Hatch Circuit",
            "United Kingdom",
        ),
        ("cota", "COTA", "Circuit of The Americas", "United States"),
        ("donington", "Donington", "Donington Park", "United Kingdom"),
        ("Hungaroring", "Hungaroring", "Hungaroring", "Hungary"),
        ("Imola", "Imola", "Autodromo Enzo e Dino Ferrari", "Italy"),
        (
            "indianapolis",
            "Indianapolis",
            "Indianapolis Motor Speedway",
            "United States",
        ),
        (
            "Kyalami",
            "Kyalami",
            "Kyalami Grand Prix Circuit",
            "South Africa",
        ),
        (
            "Laguna_Seca",
            "Laguna Seca",
            "WeatherTech Raceway Laguna Seca",
            "United States",
        ),
        (
            "misano",
            "Misano",
            "Misano World Circuit Marco Simoncelli",
            "Italy",
        ),
        ("monza", "Monza", "Autodromo Nazionale Monza", "Italy"),
        (
            "mount_panorama",
            "Mount Panorama",
            "Mount Panorama Circuit",
            "Australia",
        ),
        (
            "nurburgring",
            "Nürburgring",
            "Nürburgring-Nordschleife",
            "Germany",
        ),
        (
            "nurburgring_24h",
            "Nürburgring 24h",
            "Nürburgring 24h Circuit",
            "Germany",
        ),
        (
            "oulton_park",
            "Oulton Park",
            "Oulton Park",
            "United Kingdom",
        ),
        (
            "Paul_Ricard",
            "Paul Ricard",
            "Circuit Paul Ricard",
            "France",
        ),
        (
            "Silverstone",
            "Silverstone",
            "Silverstone Circuit",
            "United Kingdom",
        ),
        (
            "snetterton",
            "Snetterton",
            "Snetterton Circuit",
            "United Kingdom",
        ),
        ("Spa", "Spa", "Circuit de Spa-Francorchamps", "Belgium"),
        ("Suzuka", "Suzuka", "Suzuka Circuit", "Japan"),
        ("Valencia", "Valencia", "Circuit Ricardo Tormo", "Spain"),
        (
            "watkins_glen",
            "Watkins Glen",
            "Watkins Glen International",
            "United States",
        ),
        ("Zandvoort", "Zandvoort", "Circuit Zandvoort", "Netherlands"),
        ("Zolder", "Zolder", "Circuit Zolder", "Belgium"),
        ("red_bull_ring", "Red Bull Ring", "Red Bull Ring", "Austria"),
        (
            "magny_cours",
            "Magny-Cours",
            "Circuit de Nevers Magny-Cours",
            "France",
        ),
    ];

    for (id, pretty_name, full_name, country) in track_data {
        tracks.insert(
            id.to_string(),
            Track {
                id: id.to_string(),
                pretty_name: pretty_name.to_string(),
                full_name: full_name.to_string(),
                country: country.to_string(),
            },
        );
    }

    tracks
}

/// Helper function to find car by folder name
pub fn find_car_by_folder(folder_name: &str) -> Option<Car> {
    get_cars().into_values().find(|car| car.id == folder_name)
}

/// Helper function to find track by folder name
pub fn find_track_by_folder(folder_name: &str) -> Option<Track> {
    get_tracks()
        .into_values()
        .find(|track| track.id == folder_name)
}
