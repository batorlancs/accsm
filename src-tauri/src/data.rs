use crate::models::{Car, Track};
use std::collections::HashMap;

/// Static data for ACC cars
pub fn get_cars() -> HashMap<String, Car> {
    let mut cars = HashMap::new();
    
    let car_data = vec![
        ("audi_r8_evo", "audi_r8_evo", "Audi R8 LMS Evo"),
        ("audi_r8_evo_ii", "audi_r8_evo_ii", "Audi R8 LMS Evo II"),
        ("bmw_m4_gt3", "bmw_m4_gt3", "BMW M4 GT3"),
        ("bentley_continental_gt3_2018", "bentley_continental_gt3_2018", "Bentley Continental GT3 2018"),
        ("ferrari_488_gt3", "ferrari_488_gt3", "Ferrari 488 GT3"),
        ("ferrari_488_gt3_evo", "ferrari_488_gt3_evo", "Ferrari 488 GT3 Evo"),
        ("lamborghini_huracan_gt3", "lamborghini_huracan_gt3", "Lamborghini Huracán GT3"),
        ("lamborghini_huracan_gt3_evo", "lamborghini_huracan_gt3_evo", "Lamborghini Huracán GT3 Evo"),
        ("lamborghini_huracan_gt3_evo2", "lamborghini_huracan_gt3_evo2", "Lamborghini Huracán GT3 Evo2"),
        ("mclaren_720s_gt3", "mclaren_720s_gt3", "McLaren 720S GT3"),
        ("mercedes_amg_gt3", "mercedes_amg_gt3", "Mercedes-AMG GT3"),
        ("mercedes_amg_gt3_evo", "mercedes_amg_gt3_evo", "Mercedes-AMG GT3 Evo"),
        ("porsche_991_gt3_r", "porsche_991_gt3_r", "Porsche 991 GT3 R"),
        ("porsche_991ii_gt3_r", "porsche_991ii_gt3_r", "Porsche 991.2 GT3 R"),
        ("nissan_gt_r_gt3_2018", "nissan_gt_r_gt3_2018", "Nissan GT-R Nismo GT3"),
        ("lexus_rc_f_gt3", "lexus_rc_f_gt3", "Lexus RC F GT3"),
        ("honda_nsx_gt3", "honda_nsx_gt3", "Honda NSX GT3"),
        ("honda_nsx_gt3_evo", "honda_nsx_gt3_evo", "Honda NSX GT3 Evo"),
        ("alpine_a110_gt4", "alpine_a110_gt4", "Alpine A110 GT4"),
        ("aston_martin_vantage_gt4", "aston_martin_vantage_gt4", "Aston Martin Vantage GT4"),
        ("bmw_m4_gt4", "bmw_m4_gt4", "BMW M4 GT4"),
        ("chevrolet_camaro_gt4r", "chevrolet_camaro_gt4r", "Chevrolet Camaro GT4.R"),
        ("ginetta_g55_gt4", "ginetta_g55_gt4", "Ginetta G55 GT4"),
        ("ktm_xbow_gt4", "ktm_xbow_gt4", "KTM X-Bow GT4"),
        ("maserati_mc_gt4", "maserati_mc_gt4", "Maserati MC GT4"),
        ("mclaren_570s_gt4", "mclaren_570s_gt4", "McLaren 570S GT4"),
        ("mercedes_amg_gt4", "mercedes_amg_gt4", "Mercedes-AMG GT4"),
        ("porsche_718_cayman_gt4_clubsport", "porsche_718_cayman_gt4_clubsport", "Porsche 718 Cayman GT4"),
    ];

    for (id, folder_name, pretty_name) in car_data {
        cars.insert(id.to_string(), Car {
            id: id.to_string(),
            folder_name: folder_name.to_string(),
            pretty_name: pretty_name.to_string(),
        });
    }

    cars
}

/// Static data for ACC tracks
pub fn get_tracks() -> HashMap<String, Track> {
    let mut tracks = HashMap::new();
    
    let track_data = vec![
        ("barcelona", "Barcelona", "Circuit de Barcelona-Catalunya"),
        ("brands_hatch", "brands_hatch", "Brands Hatch Circuit"),
        ("cota", "cota", "Circuit of The Americas"),
        ("donington", "donington", "Donington Park"),
        ("hungaroring", "Hungaroring", "Hungaroring"),
        ("imola", "Imola", "Autodromo Enzo e Dino Ferrari"),
        ("indianapolis", "indianapolis", "Indianapolis Motor Speedway"),
        ("kyalami", "Kyalami", "Kyalami Grand Prix Circuit"),
        ("laguna_seca", "Laguna_Seca", "WeatherTech Raceway Laguna Seca"),
        ("misano", "misano", "Misano World Circuit Marco Simoncelli"),
        ("monza", "monza", "Autodromo Nazionale Monza"),
        ("mount_panorama", "mount_panorama", "Mount Panorama Circuit"),
        ("nurburgring", "nurburgring", "Nürburgring-Nordschleife"),
        ("oulton_park", "oulton_park", "Oulton Park"),
        ("paul_ricard", "Paul_Ricard", "Circuit Paul Ricard"),
        ("silverstone", "Silverstone", "Silverstone Circuit"),
        ("snetterton", "snetterton", "Snetterton Circuit"),
        ("spa", "Spa", "Circuit de Spa-Francorchamps"),
        ("suzuka", "Suzuka", "Suzuka Circuit"),
        ("valencia", "Valencia", "Circuit Ricardo Tormo"),
        ("watkins_glen", "watkins_glen", "Watkins Glen International"),
        ("zandvoort", "Zandvoort", "Circuit Zandvoort"),
        ("zolder", "Zolder", "Circuit Zolder"),
        ("red_bull_ring", "red_bull_ring", "Red Bull Ring"),
        ("magny_cours", "magny_cours", "Circuit de Nevers Magny-Cours"),
    ];

    for (id, folder_name, pretty_name) in track_data {
        tracks.insert(id.to_string(), Track {
            id: id.to_string(),
            folder_name: folder_name.to_string(),
            pretty_name: pretty_name.to_string(),
        });
    }

    tracks
}

/// Helper function to find car by folder name
pub fn find_car_by_folder(folder_name: &str) -> Option<Car> {
    get_cars().into_values().find(|car| car.folder_name == folder_name)
}

/// Helper function to find track by folder name
pub fn find_track_by_folder(folder_name: &str) -> Option<Track> {
    get_tracks().into_values().find(|track| track.folder_name == folder_name)
}
