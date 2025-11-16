use crate::models::{Car, Track};
use std::collections::HashMap;

/// Static data for ACC cars
pub fn get_cars() -> HashMap<String, Car> {
    let mut cars = HashMap::new();

    let car_data = vec![
        ("audi_r8_evo", "Audi R8 LMS Evo", "Audi", "Germany", "R8 Evo", 2019, "gt3"),
        ("audi_r8_evo_ii", "Audi R8 LMS Evo II", "Audi", "Germany", "R8 Evo II", 2022, "gt3"),
        ("bmw_m4_gt3", "BMW M4 GT3", "BMW", "Germany", "M4", 2021, "gt3"),
        (
            "bentley_continental_gt3_2018",
            "Bentley Continental GT3 2018",
            "Bentley",
            "United Kingdom",
            "Continental",
            2018,
            "gt3",
        ),
        ("ferrari_488_gt3", "Ferrari 488 GT3", "Ferrari", "Italy", "488", 2016, "gt3"),
        ("ferrari_488_gt3_evo", "Ferrari 488 GT3 Evo", "Ferrari", "Italy", "488 Evo", 2020, "gt3"),
        ("lamborghini_huracan_gt3", "Lamborghini Huracán GT3", "Lamborghini", "Italy", "Huracán", 2015, "gt3"),
        ("lamborghini_huracan_gt3_evo", "Lamborghini Huracán GT3 Evo", "Lamborghini", "Italy", "Huracán Evo", 2019, "gt3"),
        (
            "lamborghini_huracan_gt3_evo2",
            "Lamborghini Huracán GT3 Evo2",
            "Lamborghini",
            "Italy",
            "Huracán Evo2",
            2023,
            "gt3",
        ),
        ("mclaren_720s_gt3", "McLaren 720S GT3", "McLaren", "United Kingdom", "720S", 2019, "gt3"),
        ("mercedes_amg_gt3", "Mercedes-AMG GT3", "Mercedes-AMG", "Germany", "AMG GT", 2016, "gt3"),
        ("mercedes_amg_gt3_evo", "Mercedes-AMG GT3 Evo", "Mercedes-AMG", "Germany", "AMG GT Evo", 2020, "gt3"),
        ("porsche_991_gt3_r", "Porsche 991 GT3 R", "Porsche", "Germany", "991 GT3 R", 2016, "gt3"),
        ("porsche_991ii_gt3_r", "Porsche 991.2 GT3 R", "Porsche", "Germany", "991.2 GT3 R", 2019, "gt3"),
        ("nissan_gt_r_gt3_2018", "Nissan GT-R Nismo GT3", "Nissan", "Japan", "GT-R Nismo", 2018, "gt3"),
        ("lexus_rc_f_gt3", "Lexus RC F GT3", "Lexus", "Japan", "RC F", 2017, "gt3"),
        ("honda_nsx_gt3", "Honda NSX GT3", "Honda", "Japan", "NSX", 2017, "gt3"),
        ("honda_nsx_gt3_evo", "Honda NSX GT3 Evo", "Honda", "Japan", "NSX Evo", 2019, "gt3"),
        ("alpine_a110_gt4", "Alpine A110 GT4", "Alpine", "France", "A110", 2018, "gt4"),
        ("aston_martin_vantage_gt4", "Aston Martin Vantage GT4", "Aston Martin", "United Kingdom", "Vantage", 2019, "gt4"),
        ("bmw_m4_gt4", "BMW M4 GT4", "BMW", "Germany", "M4", 2018, "gt4"),
        ("chevrolet_camaro_gt4r", "Chevrolet Camaro GT4.R", "Chevrolet", "United States", "Camaro", 2017, "gt4"),
        ("ginetta_g55_gt4", "Ginetta G55 GT4", "Ginetta", "United Kingdom", "G55", 2017, "gt4"),
        ("ktm_xbow_gt4", "KTM X-Bow GT4", "KTM", "Austria", "X-Bow", 2016, "gt4"),
        ("maserati_mc_gt4", "Maserati MC GT4", "Maserati", "Italy", "MC", 2017, "gt4"),
        ("mclaren_570s_gt4", "McLaren 570S GT4", "McLaren", "United Kingdom", "570S", 2017, "gt4"),
        ("mercedes_amg_gt4", "Mercedes-AMG GT4", "Mercedes-AMG", "Germany", "AMG GT", 2017, "gt4"),
        ("porsche_718_cayman_gt4_clubsport", "Porsche 718 Cayman GT4", "Porsche", "Germany", "718 Cayman", 2019, "gt4"),
    ];

    for (id, pretty_name, brand_name, brand_country, short_name, year, car_type) in car_data {
        cars.insert(
            id.to_string(),
            Car {
                id: id.to_string(),
                pretty_name: pretty_name.to_string(),
                brand_name: brand_name.to_string(),
                brand_country: brand_country.to_string(),
                short_name: short_name.to_string(),
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
        ("Barcelona", "Circuit de Barcelona-Catalunya", "Spain"),
        ("brands_hatch", "Brands Hatch Circuit", "United Kingdom"),
        ("cota", "Circuit of The Americas", "United States"),
        ("donington", "Donington Park", "United Kingdom"),
        ("Hungaroring", "Hungaroring", "Hungary"),
        ("Imola", "Autodromo Enzo e Dino Ferrari", "Italy"),
        ("indianapolis", "Indianapolis Motor Speedway", "United States"),
        ("Kyalami", "Kyalami Grand Prix Circuit", "South Africa"),
        ("Laguna_Seca", "WeatherTech Raceway Laguna Seca", "United States"),
        ("misano", "Misano World Circuit Marco Simoncelli", "Italy"),
        ("monza", "Autodromo Nazionale Monza", "Italy"),
        ("mount_panorama", "Mount Panorama Circuit", "Australia"),
        ("nurburgring", "Nürburgring-Nordschleife", "Germany"),
        ("nurburgring_24h", "Nürburgring 24h Circuit", "Germany"),
        ("oulton_park", "Oulton Park", "United Kingdom"),
        ("Paul_Ricard", "Circuit Paul Ricard", "France"),
        ("Silverstone", "Silverstone Circuit", "United Kingdom"),
        ("snetterton", "Snetterton Circuit", "United Kingdom"),
        ("Spa", "Circuit de Spa-Francorchamps", "Belgium"),
        ("Suzuka", "Suzuka Circuit", "Japan"),
        ("Valencia", "Circuit Ricardo Tormo", "Spain"),
        ("watkins_glen", "Watkins Glen International", "United States"),
        ("Zandvoort", "Circuit Zandvoort", "Netherlands"),
        ("Zolder", "Circuit Zolder", "Belgium"),
        ("red_bull_ring", "Red Bull Ring", "Austria"),
        ("magny_cours", "Circuit de Nevers Magny-Cours", "France"),
    ];

    for (id, pretty_name, country) in track_data {
        tracks.insert(
            id.to_string(),
            Track {
                id: id.to_string(),
                pretty_name: pretty_name.to_string(),
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
