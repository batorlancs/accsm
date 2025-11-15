use crate::models::{Car, Track};
use std::collections::HashMap;

/// Static data for ACC cars
pub fn get_cars() -> HashMap<String, Car> {
    let mut cars = HashMap::new();

    let car_data = vec![
        ("audi_r8_evo", "Audi R8 LMS Evo", "Audi", "Germany"),
        ("audi_r8_evo_ii", "Audi R8 LMS Evo II", "Audi", "Germany"),
        ("bmw_m4_gt3", "BMW M4 GT3", "BMW", "Germany"),
        (
            "bentley_continental_gt3_2018",
            "Bentley Continental GT3 2018",
            "Bentley",
            "United Kingdom",
        ),
        ("ferrari_488_gt3", "Ferrari 488 GT3", "Ferrari", "Italy"),
        ("ferrari_488_gt3_evo", "Ferrari 488 GT3 Evo", "Ferrari", "Italy"),
        ("lamborghini_huracan_gt3", "Lamborghini Huracán GT3", "Lamborghini", "Italy"),
        ("lamborghini_huracan_gt3_evo", "Lamborghini Huracán GT3 Evo", "Lamborghini", "Italy"),
        (
            "lamborghini_huracan_gt3_evo2",
            "Lamborghini Huracán GT3 Evo2",
            "Lamborghini",
            "Italy",
        ),
        ("mclaren_720s_gt3", "McLaren 720S GT3", "McLaren", "United Kingdom"),
        ("mercedes_amg_gt3", "Mercedes-AMG GT3", "Mercedes-AMG", "Germany"),
        ("mercedes_amg_gt3_evo", "Mercedes-AMG GT3 Evo", "Mercedes-AMG", "Germany"),
        ("porsche_991_gt3_r", "Porsche 991 GT3 R", "Porsche", "Germany"),
        ("porsche_991ii_gt3_r", "Porsche 991.2 GT3 R", "Porsche", "Germany"),
        ("nissan_gt_r_gt3_2018", "Nissan GT-R Nismo GT3", "Nissan", "Japan"),
        ("lexus_rc_f_gt3", "Lexus RC F GT3", "Lexus", "Japan"),
        ("honda_nsx_gt3", "Honda NSX GT3", "Honda", "Japan"),
        ("honda_nsx_gt3_evo", "Honda NSX GT3 Evo", "Honda", "Japan"),
        ("alpine_a110_gt4", "Alpine A110 GT4", "Alpine", "France"),
        ("aston_martin_vantage_gt4", "Aston Martin Vantage GT4", "Aston Martin", "United Kingdom"),
        ("bmw_m4_gt4", "BMW M4 GT4", "BMW", "Germany"),
        ("chevrolet_camaro_gt4r", "Chevrolet Camaro GT4.R", "Chevrolet", "United States"),
        ("ginetta_g55_gt4", "Ginetta G55 GT4", "Ginetta", "United Kingdom"),
        ("ktm_xbow_gt4", "KTM X-Bow GT4", "KTM", "Austria"),
        ("maserati_mc_gt4", "Maserati MC GT4", "Maserati", "Italy"),
        ("mclaren_570s_gt4", "McLaren 570S GT4", "McLaren", "United Kingdom"),
        ("mercedes_amg_gt4", "Mercedes-AMG GT4", "Mercedes-AMG", "Germany"),
        ("porsche_718_cayman_gt4_clubsport", "Porsche 718 Cayman GT4", "Porsche", "Germany"),
    ];

    for (id, pretty_name, brand_name, brand_country) in car_data {
        cars.insert(
            id.to_string(),
            Car {
                id: id.to_string(),
                pretty_name: pretty_name.to_string(),
                brand_name: brand_name.to_string(),
                brand_country: brand_country.to_string(),
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
