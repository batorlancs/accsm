use crate::models::{Car, Track};
use std::collections::HashMap;

/// Static data for ACC cars
pub fn get_cars() -> HashMap<String, Car> {
    let mut cars = HashMap::new();
    
    let car_data = vec![
        ("audi_r8_evo", "Audi R8 LMS Evo"),
        ("audi_r8_evo_ii", "Audi R8 LMS Evo II"),
        ("bmw_m4_gt3", "BMW M4 GT3"),
        ("bentley_continental_gt3_2018", "Bentley Continental GT3 2018"),
        ("ferrari_488_gt3", "Ferrari 488 GT3"),
        ("ferrari_488_gt3_evo", "Ferrari 488 GT3 Evo"),
        ("lamborghini_huracan_gt3", "Lamborghini Huracán GT3"),
        ("lamborghini_huracan_gt3_evo", "Lamborghini Huracán GT3 Evo"),
        ("lamborghini_huracan_gt3_evo2", "Lamborghini Huracán GT3 Evo2"),
        ("mclaren_720s_gt3", "McLaren 720S GT3"),
        ("mercedes_amg_gt3", "Mercedes-AMG GT3"),
        ("mercedes_amg_gt3_evo", "Mercedes-AMG GT3 Evo"),
        ("porsche_991_gt3_r", "Porsche 991 GT3 R"),
        ("porsche_991ii_gt3_r", "Porsche 991.2 GT3 R"),
        ("nissan_gt_r_gt3_2018", "Nissan GT-R Nismo GT3"),
        ("lexus_rc_f_gt3", "Lexus RC F GT3"),
        ("honda_nsx_gt3", "Honda NSX GT3"),
        ("honda_nsx_gt3_evo", "Honda NSX GT3 Evo"),
        ("alpine_a110_gt4", "Alpine A110 GT4"),
        ("aston_martin_vantage_gt4", "Aston Martin Vantage GT4"),
        ("bmw_m4_gt4", "BMW M4 GT4"),
        ("chevrolet_camaro_gt4r", "Chevrolet Camaro GT4.R"),
        ("ginetta_g55_gt4", "Ginetta G55 GT4"),
        ("ktm_xbow_gt4", "KTM X-Bow GT4"),
        ("maserati_mc_gt4", "Maserati MC GT4"),
        ("mclaren_570s_gt4", "McLaren 570S GT4"),
        ("mercedes_amg_gt4", "Mercedes-AMG GT4"),
        ("porsche_718_cayman_gt4_clubsport", "Porsche 718 Cayman GT4"),
    ];

    for (id, pretty_name) in car_data {
        cars.insert(id.to_string(), Car {
            id: id.to_string(),
            pretty_name: pretty_name.to_string(),
        });
    }

    cars
}

/// Static data for ACC tracks
pub fn get_tracks() -> HashMap<String, Track> {
    let mut tracks = HashMap::new();
    
    let track_data = vec![
        ("Barcelona", "Circuit de Barcelona-Catalunya"),
        ("brands_hatch", "Brands Hatch Circuit"),
        ("cota", "Circuit of The Americas"),
        ("donington", "Donington Park"),
        ("Hungaroring", "Hungaroring"),
        ("Imola", "Autodromo Enzo e Dino Ferrari"),
        ("indianapolis", "Indianapolis Motor Speedway"),
        ("Kyalami", "Kyalami Grand Prix Circuit"),
        ("Laguna_Seca", "WeatherTech Raceway Laguna Seca"),
        ("misano", "Misano World Circuit Marco Simoncelli"),
        ("monza", "Autodromo Nazionale Monza"),
        ("mount_panorama", "Mount Panorama Circuit"),
        ("nurburgring", "Nürburgring-Nordschleife"),
        ("oulton_park", "Oulton Park"),
        ("Paul_Ricard", "Circuit Paul Ricard"),
        ("Silverstone", "Silverstone Circuit"),
        ("snetterton", "Snetterton Circuit"),
        ("Spa", "Circuit de Spa-Francorchamps"),
        ("Suzuka", "Suzuka Circuit"),
        ("Valencia", "Circuit Ricardo Tormo"),
        ("watkins_glen", "Watkins Glen International"),
        ("Zandvoort", "Circuit Zandvoort"),
        ("Zolder", "Circuit Zolder"),
        ("red_bull_ring", "Red Bull Ring"),
        ("magny_cours", "Circuit de Nevers Magny-Cours"),
    ];

    for (id, pretty_name) in track_data {
        tracks.insert(id.to_string(), Track {
            id: id.to_string(),
            pretty_name: pretty_name.to_string(),
        });
    }

    tracks
}

/// Helper function to find car by folder name
pub fn find_car_by_folder(folder_name: &str) -> Option<Car> {
    get_cars().into_values().find(|car| car.id == folder_name)
}

/// Helper function to find track by folder name
pub fn find_track_by_folder(folder_name: &str) -> Option<Track> {
    get_tracks().into_values().find(|track| track.id == folder_name)
}
