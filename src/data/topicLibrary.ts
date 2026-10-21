import { TopicPreset } from '../types/wordSearch';

export interface ThemedSubtopic {
  title: string;
  category?: string;
  words: string[];
}

export interface SeedCluster {
  id: string;
  name: string;
  category: string;
  matchTerms: string[];
  subtopics: ThemedSubtopic[];
}

export interface ThemedTopic {
  id: string;
  category: string;
  title: string;
  words: string[];
}

export const SEED_CLUSTERS: SeedCluster[] = [
  // -------------------------------------------------------------
  // 1. AMERICAN HISTORY
  // -------------------------------------------------------------
  {
    id: 'american_history',
    name: 'American History',
    category: 'History & Culture',
    matchTerms: ['american history', 'us history', 'usa', 'united states', 'america', 'american'],
    subtopics: [
      {
        title: 'Presidents of the United States',
        words: ['WASHINGTON', 'JEFFERSON', 'LINCOLN', 'ROOSEVELT', 'EISENHOWER', 'KENNEDY', 'MADISON', 'MONROE', 'JACKSON', 'TRUMAN', 'REAGAN', 'ADAMS', 'MCKINLEY', 'GARFIELD', 'GRANT', 'TAFT', 'WILSON', 'COOLIDGE']
      },
      {
        title: 'The Revolutionary War',
        words: ['MINUTEMEN', 'BUNKER HILL', 'VALLEY FORGE', 'SARATOGA', 'REDCOATS', 'CONTINENTAL', 'INDEPENDENCE', 'YORKTOWN', 'CORNWALLIS', 'PAUL REVERE', 'LEXINGTON', 'PATRIOT', 'MILITIA', 'BOYCOTT', 'TEA PARTY', 'SOVEREIGN']
      },
      {
        title: 'Founding Fathers & Constitution',
        words: ['CONSTITUTION', 'PREAMBLE', 'AMENDMENT', 'BILL OF RIGHTS', 'JEFFERSON', 'HAMILTON', 'MADISON', 'BEN FRANKLIN', 'FEDERALIST', 'DEMOCRACY', 'RATIFICATION', 'CITIZENSHIP', 'CONGRESS', 'ASSEMBLY', 'LIBERTY', 'EQUALITY']
      },
      {
        title: 'The Civil War Era',
        words: ['GETTYSBURG', 'EMANCIPATION', 'CONFEDERACY', 'APPOMATTOX', 'UNION ARMY', 'ANTIETAM', 'STONEWALL', 'BULL RUN', 'FORT SUMTER', 'BLUE AND GRAY', 'RECONSTRUCTION', 'SECESSION', 'BLOCKADE', 'CAVALRY', 'PROCLAMATION', 'SOLDIER']
      },
      {
        title: 'The Wild West & Frontier',
        words: ['STAGECOACH', 'GOLD RUSH', 'HOMESTEAD', 'OREGON TRAIL', 'COWBOY', 'PIONEER', 'PRAIRIE', 'RANCHER', 'SALOON', 'WAGON TRAIN', 'FRONTIER', 'GHOST TOWN', 'OUTLAW', 'SHERIFF', 'BONANZA', 'PROSPECTOR', 'DESPERADO']
      },
      {
        title: 'Manifest Destiny & Expansion',
        words: ['LOUISIANA', 'LEWIS AND CLARK', 'THE ALAMO', 'TRANSCONTINENTAL', 'EXPANSION', 'SACAGAWEA', 'PACIFIC', 'EXPEDITION', 'TERRITORY', 'SETTLER', 'BORDERLAND', 'NAVIGATION', 'CARAVAN', 'WILDERNESS', 'PURCHASE', 'TREATY']
      },
      {
        title: 'The Space Race & Moon Landing',
        words: ['APOLLO', 'NEIL ARMSTRONG', 'SATURN FIVE', 'CAPE CANAVERAL', 'LUNAR MODULE', 'BUZZ ALDRIN', 'HOUSTON', 'SPUTNIK', 'MERCURY', 'GEMINI', 'SPLASHDOWN', 'TRANSMISSION', 'ORBITER', 'ASTRONAUT', 'MISSION CONTROL', 'ROCKETRY']
      },
      {
        title: 'The Vietnam War Era',
        words: ['SAIGON', 'TONKIN GULF', 'HELICOPTER', 'MEKONG DELTA', 'GUERRILLA', 'MONSOON', 'JUNGLE', 'TET OFFENSIVE', 'CEASEFIRE', 'VETERAN', 'PATROL', 'DRAFT', 'INFANTRY', 'MEDEVAC', 'AMBUSH', 'RECONNAISSANCE']
      },
      {
        title: 'The Cold War Era',
        words: ['IRON CURTAIN', 'BERLIN WALL', 'AIRLIFT', 'CUBAN MISSILE', 'ESPIONAGE', 'DETERRENCE', 'CONTAINMENT', 'CHECKPOINT', 'KREMLIN', 'PENTAGON', 'DIPLOMACY', 'SUPERPOWER', 'BLOCKADE', 'SATELLITE', 'ALLIANCE', 'DEFCON']
      },
      {
        title: 'The Roaring Twenties',
        words: ['JAZZ AGE', 'FLAPPER', 'PROHIBITION', 'SPEAKEASY', 'CHARLESTON', 'ART DECO', 'RADIO BOOM', 'BOOTLEGGER', 'AUTOMOBILE', 'GREAT GATSBY', 'METROPOLIS', 'SYNCOPATION', 'PHONOGRAPH', 'CABARET', 'STOCK EXCHANGE', 'MODERNITY']
      },
      {
        title: 'The Great Depression & New Deal',
        words: ['DUST BOWL', 'STOCK CRASH', 'ROOSEVELT', 'HOOVERVILLE', 'BREADLINE', 'SOCIAL SECURITY', 'WORKS PROGRESS', 'DROUGHT', 'RECOVERY', 'BANK RUN', 'CIVILIAN CORPS', 'FIRESIDE CHAT', 'TENNESSEE VALLEY', 'MIGRANT', 'MORTGAGE']
      },
      {
        title: 'World War II Home Front',
        words: ['PEARL HARBOR', 'ROSIE RIVETER', 'VICTORY GARDEN', 'RATION BOOK', 'LIBERTY SHIP', 'NORMANDY', 'MIDWAY', 'GENERAL PATTON', 'PACIFIC FLEET', 'WAR BONDS', 'BLACKOUT', 'ARSENAL', 'DEFENSE WORKER', 'CANTEEN', 'COURAGE']
      },
      {
        title: 'The Civil Rights Movement',
        words: ['ROSA PARKS', 'MARTIN LUTHER', 'FREEDOM RIDERS', 'BUS BOYCOTT', 'SELMA MARCH', 'WASHINGTON MARCH', 'DESEGREGATION', 'VOTING RIGHTS', 'SIT IN', 'JUSTICE', 'INTEGRATION', 'EQUALITY', 'NONVIOLENCE', 'LEADERSHIP', 'DIGNITY']
      },
      {
        title: 'Industrial Revolution & Inventions',
        words: ['ASSEMBLY LINE', 'TELEGRAPH', 'STEAM ENGINE', 'LIGHT BULB', 'THOMAS EDISON', 'HENRY FORD', 'ALEXANDER BELL', 'LOCOMOTIVE', 'STEEL MILL', 'OIL DERRICK', 'PATENT', 'ELECTRICITY', 'FACTORIES', 'MASS PRODUCTION', 'FOUNDRY']
      },
      {
        title: 'National Parks & Conservation',
        words: ['YELLOWSTONE', 'YOSEMITE', 'JOHN MUIR', 'GRAND CANYON', 'PARK RANGER', 'SEQUOIA', 'PRESERVATION', 'WILDERNESS', 'SMOKY MOUNTAIN', 'EVERGLADES', 'ZION CANYON', 'CRATER LAKE', 'MAMMOTH CAVE', 'SANCTUARY', 'MONUMENT']
      },
      {
        title: 'Colonial Life & Settlements',
        words: ['MAYFLOWER', 'PLYMOUTH ROCK', 'JAMESTOWN', 'PURITAN', 'PILGRIMS', 'THANKSGIVING', 'BLACKSMITH', 'COLONIAL TAVERN', 'HARBOR', 'CHARTER', 'COMMONWEALTH', 'SETTLEMENT', 'LOG CABIN', 'CANDLEMAKER', 'TOWNSHIP']
      },
      {
        title: 'American Folk Legends & Lore',
        words: ['PAUL BUNYAN', 'JOHNNY APPLESEED', 'DAVY CROCKETT', 'PECOS BILL', 'CASEY JONES', 'RIP VAN WINKLE', 'TALL TALES', 'BABE BLUE OX', 'FRONTIER LORE', 'SLEEPY HOLLOW', 'APPALACHIAN', 'BANJO TUNE', 'FOLK HERO', 'MYTHOLOGY']
      },
      {
        title: 'Famous American Monuments',
        words: ['STATUE LIBERTY', 'MOUNT RUSHMORE', 'LINCOLN MEMORIAL', 'WASHINGTON PILLAR', 'LIBERTY BELL', 'GATEWAY ARCH', 'HOOVER DAM', 'INDEPENDENCE HALL', 'GOLDEN GATE', 'ARLINGTON', 'ALAMO SHRINE', 'MONUMENT VALLEY']
      },
      {
        title: 'Women’s Suffrage Movement',
        words: ['SUSAN ANTHONY', 'ELIZABETH STANTON', 'NINETEENTH', 'BALLOT BOX', 'SUFFRAGETTE', 'EQUAL RIGHTS', 'ENFRANCHISEMENT', 'SENECA FALLS', 'CONVENTION', 'ACTIVIST', 'VOTING TICKET', 'PETITION', 'REFORM', 'MARCHERS']
      },
      {
        title: 'The Harlem Renaissance',
        words: ['LANGSTON HUGHES', 'COTTON CLUB', 'BLUES MUSIC', 'POETRY', 'APOLLO THEATER', 'DUKE ELLINGTON', 'LOUIS ARMSTRONG', 'LITERARY SALON', 'PAINTINGS', 'JAZZ IMPROV', 'SCULPTURE', 'CREATIVITY', 'HARLEM NIGHTS']
      },
      {
        title: 'Native American Nations & Heritage',
        words: ['CHEROKEE', 'NAVAJO NATION', 'SIOUX', 'IROQUOIS', 'APACHE', 'CHEYENNE', 'PUEBLO', 'COMANCHE', 'CHICKASAW', 'SEMINOLE', 'POTTERY', 'TIPI', 'TOTEM POLE', 'BISON HUNT', 'TURQUOISE', 'POWWOW']
      },
      {
        title: 'The California Gold Rush of 1849',
        words: ['SUTTERS MILL', 'FORTY NINERS', 'GOLD NUGGET', 'PROSPECTOR', 'PANNING', 'SLUICE BOX', 'MOTHER LODE', 'SAN FRANCISCO', 'BOOMTOWN', 'PLACER MINING', 'STRIKE IT RICH', 'ASSAY OFFICE', 'CLAIM JUMPER']
      },
      {
        title: 'The Transcontinental Railroad',
        words: ['PROMONTORY', 'GOLDEN SPIKE', 'UNION PACIFIC', 'CENTRAL PACIFIC', 'LOCOMOTIVE', 'SIERRA NEVADA', 'TRACK LAYER', 'STEAM ENGINE', 'TIES', 'BOXCAR', 'TELEGRAPH LINE', 'CROSS COUNTRY', 'RAILHEAD']
      },
      {
        title: 'Declaration of Independence & Signers',
        words: ['THOMAS JEFFERSON', 'JOHN HANCOCK', 'BEN FRANKLIN', 'JOHN ADAMS', 'INALIENABLE', 'PHILADELPHIA', 'CONTINENTAL', 'LIBERTY BELL', 'PARCHMENT', 'QUILL PEN', 'SIGNATURE', 'TYRANNY', 'UNANIMOUS']
      },
      {
        title: 'Battles of the Revolutionary War',
        words: ['LEXINGTON GREEN', 'CONCORD BRIDGE', 'BUNKER HILL', 'TRENTON CROSSING', 'SARATOGA VICTORY', 'VALLEY FORGE', 'BRANDYWINE', 'MONMOUTH', 'COWPENS', 'GUILFORD', 'YORKTOWN SIEGE', 'CORNWALLIS']
      },
      {
        title: 'Generals of the American Civil War',
        words: ['ULYSSES GRANT', 'ROBERT E LEE', 'STONEWALL', 'WILLIAM SHERMAN', 'GEORGE MEADE', 'JEB STUART', 'PHILIP SHERIDAN', 'BRAXTON BRAGG', 'LONGSREET', 'BURNSIDE', 'CAVALRY CHARGE', 'COMMANDER']
      },
      {
        title: 'The Underground Railroad',
        words: ['HARRIET TUBMAN', 'CONDUCTOR', 'SAFEHOUSE', 'FREEDOM TRAIN', 'MIDNIGHT PATH', 'ABOLITIONIST', 'FREDERICK DOUGLASS', 'STATION MASTER', 'LANTERN LIGHT', 'SECRET CODE', 'NORTH STAR', 'ESCAPE']
      },
      {
        title: 'The Battle of Gettysburg',
        words: ['LITTLE ROUND TOP', 'PICKETTS CHARGE', 'CEMETERY RIDGE', 'DEVILS DEN', 'PEACH ORCHARD', 'HIGH WATER MARK', 'CULPS HILL', 'PENNSYLVANIA', 'GETTYSBURG ADDRESS', 'LINCOLN SPEECH', 'SOLDIERS CEMETERY']
      },
      {
        title: 'World War I & The Doughboys',
        words: ['TRENCH WARFARE', 'DOUGHBOY', 'ARMISTICE DAY', 'WOODROW WILSON', 'LEAGUE NATIONS', 'SERGEANT YORK', 'ARGONNE FOREST', 'GAS MASK', 'OVER THERE', 'DOGFIGHT', 'ALLIED POWERS', 'VETERANS']
      },
      {
        title: 'D-Day & The Liberation of Europe',
        words: ['OPERATION OVERLORD', 'OMAHA BEACH', 'UTAH BEACH', 'NORMANDY COAST', 'PARATROOPER', 'HIGGINS BOAT', 'ALLIED INVASION', 'EISENHOWER', 'POINT DU HOC', 'MULBERRY HARBOR', 'LIBERATION']
      },
      {
        title: 'The Manhattan Project & Atomic Era',
        words: ['LOS ALAMOS', 'OPPENHEIMER', 'TRINITY TEST', 'ENRICO FERMI', 'NEW MEXICO', 'OAK RIDGE', 'PLUTONIUM', 'URANIUM CORE', 'SECRET CITY', 'PHYSICIST', 'ATOMIC DAWN', 'GEIGER COUNTER']
      },
      {
        title: 'Route 66 & The American Highway',
        words: ['MOTHER ROAD', 'CHICAGO TO LA', 'ROAD TRIP', 'NEON SIGNS', 'MOTOR COURT', 'DINER BOOTH', 'SERVICE STATION', 'CONVERTIBLE', 'CROSS COUNTRY', 'HIGHWAY CORRIDOR', 'CORVETTE', 'MIDWEST ROUTE']
      },
      {
        title: 'Silicon Valley & The Digital Age',
        words: ['MICROPROCESSOR', 'SILICON CHIP', 'PERSONAL COMPUTER', 'STEVE JOBS', 'GARAGE STARTUP', 'SOFTWARE CODE', 'INTERNET BOOM', 'SEMICONDUCTOR', 'VENTURE CAPITAL', 'INNOVATION HUB', 'CYBERSPACE']
      },
      {
        title: 'First Ladies of the United States',
        words: ['ELEANOR ROOSEVELT', 'ABIGAIL ADAMS', 'DOLLEY MADISON', 'JACQUELINE KENNEDY', 'MARTHA WASHINGTON', 'LADY BIRD JOHNSON', 'BARBARA BUSH', 'WHITE HOUSE HOSTESS', 'PUBLIC SERVICE', 'EAST WING']
      },
      {
        title: 'Texas Independence & The Alamo',
        words: ['SAN ANTONIO', 'DAVEY CROCKETT', 'JIM BOWIE', 'WILLIAM TRAVIS', 'SAM HOUSTON', 'SAN JACINTO', 'LONE STAR STATE', 'REPUBLIC TEXAS', 'REMEMBER ALAMO', 'MISSION FORT', 'TEJANO LEADER']
      },
      {
        title: 'The Lewis and Clark Expedition',
        words: ['CORPS DISCOVERY', 'MERIWETHER LEWIS', 'WILLIAM CLARK', 'SACAGAWEA GUIDE', 'MISSOURI RIVER', 'PACIFIC OCEAN', 'CONTINENTAL DIVIDE', 'KEELBOAT', 'WILDERNESS MAP', 'FORT CLATSOP']
      },
      {
        title: 'American Folk Music & Bluegrass',
        words: ['ACOUSTIC GUITAR', 'FIVE STRING BANJO', 'FIDDLE TUNE', 'MANDOLIN CHOP', 'UPRIGHT BASS', 'APPALACHIAN', 'WOODY GUTHRIE', 'BALLAD SINGER', 'HOEDOWN', 'HARMONICA REED', 'FOLK ANTHEM']
      },
      {
        title: 'The Golden Age of Hollywood',
        words: ['SILVER SCREEN', 'STUDIO SYSTEM', 'HUMPHREY BOGART', 'KATHARINE HEPBURN', 'CITIZEN KANE', 'TECHNICOLOR', 'ACADEMY AWARD', 'CINEMATOGRAPHY', 'BOX OFFICE', 'SOUNDSTAGE', 'PARAMOUNT']
      },
      {
        title: 'Iconic American Authors & Poets',
        words: ['MARK TWAIN', 'ERNEST HEMINGWAY', 'EDGAR ALLAN POE', 'EMILY DICKINSON', 'F SCOTT FITZGERALD', 'JOHN STEINBECK', 'WALT WHITMAN', 'HERMAN MELVILLE', 'ROBERT FROST', 'GREAT NOVEL']
      },
      {
        title: 'American Sports & Baseball Legends',
        words: ['BABE RUTH', 'JACKIE ROBINSON', 'LOU GEHRIG', 'WILLIE MAYS', 'WORLD SERIES', 'HOME RUN TROT', 'BALLPARK FENCE', 'PENNANT RACE', 'COOPERSTOWN', 'NATIONAL PASTIME', 'GRAND SLAM']
      },
      {
        title: 'Landmark Supreme Court Cases',
        words: ['BROWN V BOARD', 'MARBURY MADISON', 'CHIEF JUSTICE', 'JUDICIAL REVIEW', 'ROBE GAVEL', 'CONSTITUTIONAL LAW', 'ORAL ARGUMENT', 'LANDMARK PRECEDENT', 'DISSENTING OPINION', 'HIGH COURT']
      },
      {
        title: 'The Oregon Trail Pioneers',
        words: ['COVERED WAGON', 'INDEPENDENCE MISSOURI', 'CHIMNEY ROCK', 'SCOTTS BLUFF', 'SNAKE RIVER', 'COLUMBIA VALLEY', 'OXEN TEAM', 'TRAIL DUST', 'FORBIDDING PASS', 'HOMESTEAD CLAIM']
      },
      {
        title: 'American Architecture & Skyscrapers',
        words: ['EMPIRE STATE', 'CHRYSLER TOWER', 'FRANK LLOYD WRIGHT', 'FALLINGWATER', 'ART DECO SPIRE', 'STEEL SKELETON', 'SUSPENSION BRIDGE', 'BROOKLYN BRIDGE', 'MANHATTAN SKYLINE', 'CATHEDRAL']
      }
    ]
  },

  // -------------------------------------------------------------
  // 2. SPACE & ASTRONOMY
  // -------------------------------------------------------------
  {
    id: 'space_astronomy',
    name: 'Space & Astronomy',
    category: 'Science & Cosmos',
    matchTerms: ['space', 'astronomy', 'cosmos', 'universe', 'planets', 'galaxy', 'astrophysics', 'stargazing'],
    subtopics: [
      {
        title: 'Planets of the Solar System',
        words: ['MERCURY', 'VENUS', 'EARTH', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO', 'ATMOSPHERE', 'RINGS', 'GRAVITATION', 'ORBITAL PLANE', 'ROTATION', 'GAS GIANT', 'TERRESTRIAL']
      },
      {
        title: 'The Moon & Lunar Exploration',
        words: ['CRATER', 'SEA TRANQUILITY', 'LUNAR ECLIPSE', 'APOLLO LANDER', 'REGOLITH', 'FULL MOON', 'CRESCENT', 'TIDAL LOCK', 'HIGHLANDS', 'BASALT', 'ORBITER', 'FAR SIDE', 'PERIGEE', 'WAXING GIBBOUS']
      },
      {
        title: 'Galaxies & Deep Space Nebulae',
        words: ['MILKY WAY', 'ANDROMEDA', 'SPIRAL ARM', 'ORION NEBULA', 'EAGLE NEBULA', 'COSMIC DUST', 'PROTOSTAR', 'INTERSTELLAR', 'STELLAR NURSERY', 'CRAB NEBULA', 'LIGHT YEAR', 'CLUSTER', 'SUPERCLUSTER']
      },
      {
        title: 'Stars, Supernovae & Pulsars',
        words: ['SUPERNOVA', 'WHITE DWARF', 'RED GIANT', 'NEUTRON STAR', 'PULSAR BEACON', 'NUCLEAR FUSION', 'MAIN SEQUENCE', 'LUMINOSITY', 'SOLAR FLARE', 'PHOTOSPHERE', 'CORONA', 'STELLAR WIND', 'MAGNETAR']
      },
      {
        title: 'Cosmic Mysteries & Black Holes',
        words: ['EVENT HORIZON', 'SINGULARITY', 'SPACETIME', 'ACCRETION DISK', 'DARK MATTER', 'DARK ENERGY', 'GRAVITATIONAL', 'WORMHOLE', 'HAWKING RADIATION', 'RELATIVITY', 'COSMIC VOID', 'TIME DILATION']
      },
      {
        title: 'Telescopes & Observatories',
        words: ['HUBBLE', 'JAMES WEBB', 'SPECTROSCOPE', 'REFLECTOR', 'REFRACTOR', 'APERTURE', 'RADIO DISH', 'OBSERVATORY', 'PARANAL', 'INTERFEROMETER', 'OPTICS', 'RESOLUTION', 'FOCAL LENGTH', 'DEEP SKY']
      },
      {
        title: 'Comets, Asteroids & Meteors',
        words: ['HALLEYS COMET', 'ASTEROID BELT', 'KUIPER BELT', 'OORT CLOUD', 'METEORITE', 'SHOOTING STAR', 'FIREBALL', 'IMPACT CRATER', 'PERSEIDS', 'ORBITAL PATH', 'COMA', 'ION TAIL', 'CHONDRITE']
      },
      {
        title: 'Constellations & Starlit Sky',
        words: ['URSA MAJOR', 'CASSIOPEIA', 'ORION HUNTER', 'PEGASUS', 'CYGNUS SWAN', 'NORTH STAR', 'POLARIS', 'ZODIAC', 'SIRIUS', 'BETELGEUSE', 'RIGEL', 'PLEIADES', 'CENTAURUS', 'CELESTIAL SPHERE']
      },
      {
        title: 'Human Space Stations & Satellites',
        words: ['SPACE STATION', 'MIR ORBITER', 'TIANGONG', 'SOLAR PANELS', 'SPACELAB', 'DOCKING PORT', 'AIRLOCK', 'MICROGRAVITY', 'COMMUNICATION', 'GEOSTATIONARY', 'TELEMETRY', 'COSMONAUT', 'SPACETRACK']
      },
      {
        title: 'Search for Exoplanets & Alien Worlds',
        words: ['HABITABLE ZONE', 'GOLDILOCKS', 'KEPLER TELESCOPE', 'EXOPLANET', 'TRANSIT METHOD', 'RADIAL VELOCITY', 'RED DWARF', 'BIOSIGNATURE', 'ATMOSPHERIC', 'TRAPPIST', 'PROXIMA', 'LIGHT CURVE']
      }
    ]
  },

  // -------------------------------------------------------------
  // 3. NATURE & WILDLIFE
  // -------------------------------------------------------------
  {
    id: 'nature_wildlife',
    name: 'Nature & Wildlife',
    category: 'Nature & Wildlife',
    matchTerms: ['nature', 'wildlife', 'animals', 'animal', 'forest', 'ocean', 'creatures', 'biology', 'earth'],
    subtopics: [
      {
        title: 'Ocean Depths & Coral Reefs',
        words: ['CORAL REEF', 'ANEMONE', 'CLOWNFISH', 'MANTA RAY', 'SEA TURTLE', 'BARRACUDA', 'OCTOPUS', 'SEAHORSE', 'JELLYFISH', 'STARFISH', 'HUMPBACK', 'LOBSTER', 'MORAY EEL', 'STINGRAY', 'TRENCH', 'ABYSS']
      },
      {
        title: 'The African Savannah',
        words: ['CHEETAH', 'ELEPHANT', 'GIRAFFE', 'LIONESS', 'ZEBRA', 'RHINOCEROS', 'HIPPOPOTAMUS', 'WARTHOG', 'WILDEBEEST', 'HYENA', 'MEERKAT', 'BABOON', 'GAZELLE', 'WATERHOLE', 'ACACIA TREE', 'IMPALA']
      },
      {
        title: 'Birds of Prey & Raptors',
        words: ['BALD EAGLE', 'PEREGRINE', 'OSPREY', 'BARN OWL', 'RED TAILED HAWK', 'KESTREL', 'HARRIER', 'GOLDEN EAGLE', 'TALONS', 'PLUMAGE', 'NESTING', 'FALCONRY', 'SOARING', 'CARACARA', 'ACCIPITER']
      },
      {
        title: 'Rainforest Canopy & Creatures',
        words: ['JAGUAR', 'TOUCAN', 'POISON DART', 'TREE FROG', 'SLOTH', 'HOWLER MONKEY', 'MACAW', 'ANACONDA', 'ORCHID', 'LIANA VINE', 'BROMELIAD', 'CHAMELEON', 'TAPIR', 'CAPYBARA', 'CANOPY', 'UNDERSTORY']
      },
      {
        title: 'Arctic & Antarctic Tundra',
        words: ['POLAR BEAR', 'EMPEROR PENGUIN', 'ARCTIC FOX', 'WALRUS', 'SNOWY OWL', 'NARWHAL', 'BELUGA WHALE', 'MUSK OX', 'PERMAFROST', 'BLIZZARD', 'GLACIER', 'PACK ICE', 'CARIBOU', 'LEMMING', 'AURORA']
      },
      {
        title: 'Woodland Mammals of the Forest',
        words: ['GRIZZLY BEAR', 'GRAY WOLF', 'RED FOX', 'WHITE TAIL DEER', 'BADGER', 'CHIPMUNK', 'BEAVER DAM', 'RACCOON', 'BOBCAT', 'PORCUPINE', 'RABBIT', 'OTTER', 'MOOSE', 'BURROW', 'FORAGING', 'HIBERNATION']
      },
      {
        title: 'Incredible Insects & Pollinators',
        words: ['MONARCH BUTTERFLY', 'HONEYBEE', 'BUMBLEBEE', 'DRAGONFLY', 'PRAYING MANTIS', 'FIREFLY', 'LADYBUG', 'SCARAB BEETLE', 'CHRYSALIS', 'NECTAR', 'POLLEN', 'CATERPILLAR', 'ANTHILL', 'WASPNEXT']
      },
      {
        title: 'Prehistoric World of Dinosaurs',
        words: ['TYRANNOSAURUS', 'TRICERATOPS', 'VELOCIRAPTOR', 'STEGOSAURUS', 'BRACHIOSAURUS', 'PTERODACTYL', 'ANKYLOSAURUS', 'ALLOSAURUS', 'FOSSIL BONE', 'JURASSIC', 'CRETACEOUS', 'PALEONTOLOGY', 'AMMONITE', 'EXCAVATION']
      },
      {
        title: 'Botanical Gardens & Flora',
        words: ['BOUGAINVILLEA', 'CHRYSANTHEMUM', 'FOXGLOVE', 'HYDRANGEA', 'JASMINE', 'LAVENDER', 'MAGNOLIA', 'MARIGOLD', 'ORCHID', 'RHODODENDRON', 'SNAPDRAGON', 'SUNFLOWER', 'TULIP BULB', 'PERIWINKLE', 'BLOSSOM']
      },
      {
        title: 'Ancient Forests & Mighty Trees',
        words: ['GIANT SEQUOIA', 'REDWOOD', 'BRISTLECONE', 'BAOBAB', 'CYPRESS', 'SYCAMORE', 'MAGNOLIA', 'WEEPING WILLOW', 'ASPEN GROVE', 'WHITE OAK', 'SUGAR MAPLE', 'PONDEROSA', 'CHESTNUT', 'FOREST CANOPY']
      }
    ]
  },

  // -------------------------------------------------------------
  // 4. FOOD & CULINARY ARTS
  // -------------------------------------------------------------
  {
    id: 'food_culinary',
    name: 'Food & Culinary Arts',
    category: 'Food & Cooking',
    matchTerms: ['food', 'cooking', 'culinary', 'baking', 'cuisine', 'chef', 'restaurant', 'gastronomy', 'kitchen'],
    subtopics: [
      {
        title: 'Artisan Breads & Sourdough',
        words: ['SOURDOUGH', 'BAGUETTE', 'BRIOCHE', 'CIABATTA', 'FOCACCIA', 'PUMPERNICKEL', 'CHALLAH', 'RYE LOAF', 'LEAVEN', 'FERMENTATION', 'DUTCH OVEN', 'KNEADING', 'CRUST', 'SCORE MARK', 'BAKERS YEAST']
      },
      {
        title: 'Italian Trattoria & Pasta',
        words: ['RISOTTO', 'TAGLIATELLE', 'CARBONARA', 'BRUSCHETTA', 'PROSCIUTTO', 'PARMIGIANO', 'PESTO GENOVESE', 'GNOCCHI', 'RAVIOLI', 'LASAGNA', 'TIRAMISU', 'BALSAMICO', 'EXTRA VIRGIN', 'OREGANO', 'MARINARA']
      },
      {
        title: 'French Patisserie & Desserts',
        words: ['CROISSANT', 'ECLAIR', 'MACARON', 'MILLE FEUILLE', 'TARTE TATIN', 'CREME BRULEE', 'PROFITEROLE', 'MADELEINE', 'SOUFFLE', 'MERINGUE', 'CHOUX PASTRY', 'GANACHE', 'PRALINE', 'BRIOCHE']
      },
      {
        title: 'Coffee Roastery & Barista Craft',
        words: ['ESPRESSO', 'CAPPUCCINO', 'FLAT WHITE', 'MACCHIATO', 'ARABICA', 'ROBUSTA', 'COLD BREW', 'POUR OVER', 'MOKA POT', 'FROTHER', 'CREMA', 'ROAST PROFILE', 'TAMPER', 'DECAF BEANS', 'PORTAFILTER']
      },
      {
        title: 'Japanese Sushi & Izakaya',
        words: ['NIGIRI SUSHI', 'SASHIMI', 'EDAMAME', 'WASABI PASTE', 'TEMPURA', 'TONKOTSU', 'MISO SOUP', 'MATCHA GREEN', 'NORI SEAWEED', 'TERIYAKI', 'YAKITORI', 'RAMEN NOODLE', 'GINGER SLICE', 'SAKE BREW']
      },
      {
        title: 'Exotic Spices of the Silk Road',
        words: ['CARDAMOM', 'STAR ANISE', 'CINNAMON BARK', 'CORIANDER', 'TURMERIC', 'SAFFRON THREAD', 'CLOVES', 'NUTMEG', 'FENNEL SEED', 'CUMIN', 'PEPPERCORN', 'PAPRIKA', 'ALLSPICE', 'FENUGREEK', 'SUMAC']
      },
      {
        title: 'Mexican Street Tacos & Fiesta',
        words: ['GUACAMOLE', 'ENCHILADA', 'QUESADILLA', 'SALSA VERDE', 'CARNITAS', 'TORTILLA', 'CILANTRO', 'CHIPOTLE', 'TAMALES', 'CHURROS', 'PICO DE GALLO', 'POBLANO', 'JALAPENO', 'COJITA CHEESE', 'HORCHATA']
      },
      {
        title: 'Cheeses of the World',
        words: ['GOUDA', 'CHEDDAR', 'BRIE DE MEAUX', 'CAMEMBERT', 'ROQUEFORT', 'MANCHEGO', 'GRUYERE', 'PROVOLONE', 'GORGONZOLA', 'FETA BRINE', 'MOZZARELLA', 'RICOTTA', 'HAVARTI', 'CHEESEBOARD', 'RIND']
      },
      {
        title: 'Chocolatier & Fine Confections',
        words: ['TRUFFLE', 'COCOA BEAN', 'DARK CHOCOLATE', 'CARAMEL', 'PRALINE', 'FUDGE', 'BONBON', 'TEMPERING', 'GANACHE', 'TOFFEE', 'NOUGAT', 'MARZIPAN', 'FONDANT', 'WAFER', 'CHIP CHOCOLATE']
      },
      {
        title: 'Farm-to-Table Vegetable Harvest',
        words: ['HEIRLOOM TOMATO', 'ASPARAGUS', 'ARTICHOKE', 'BUTTERNUT SQUASH', 'KALE LEAF', 'SWISS CHARD', 'BEETROOT', 'RADISH', 'ZUCCHINI', 'BELL PEPPER', 'EGGPLANT', 'HARVEST BASKET', 'PARSNIP', 'SHALLOT']
      }
    ]
  },

  // -------------------------------------------------------------
  // 5. WORLD GEOGRAPHY & TRAVEL
  // -------------------------------------------------------------
  {
    id: 'world_geography',
    name: 'World Geography & Travel',
    category: 'Geography & Travel',
    matchTerms: ['geography', 'travel', 'world', 'countries', 'capitals', 'places', 'islands', 'mountains', 'continents'],
    subtopics: [
      {
        title: 'Historic Capitals of Europe',
        words: ['PARIS', 'LONDON', 'ROME', 'MADRID', 'BERLIN', 'VIENNA', 'AMSTERDAM', 'PRAGUE', 'BUDAPEST', 'LISBON', 'ATHENS', 'DUBLIN', 'COPENHAGEN', 'STOCKHOLM', 'OSLO', 'WARSAW', 'HELSINKI', 'BRUSSELS']
      },
      {
        title: 'Asian Metropolises & Cities',
        words: ['TOKYO', 'SEOUL', 'BANGKOK', 'SINGAPORE', 'BEIJING', 'SHANGHAI', 'KYOTO', 'MUMBAI', 'NEW DELHI', 'HANOI', 'KUALA LUMPUR', 'MANILA', 'TAIPEI', 'JAKARTA', 'OSAKA', 'HONG KONG']
      },
      {
        title: 'Mighty Mountain Ranges & Peaks',
        words: ['EVEREST', 'KILIMANJARO', 'MATTERHORN', 'MONT BLANC', 'DENALI', 'ACONCAGUA', 'HIMALAYAS', 'ROCKY MOUNTAIN', 'ANDES RANGE', 'ALPS PEAK', 'CARPATHIANS', 'PYRENEES', 'SUMMIT', 'GLACIER PASS', 'RIDGE']
      },
      {
        title: 'Great Rivers of the Globe',
        words: ['AMAZON RIVER', 'NILE RIVER', 'DANUBE', 'MISSISSIPPI', 'YANGTZE', 'RHINE', 'VOLGA', 'GANGES', 'MEKONG', 'COLORADO RIVER', 'THAMES', 'SEINE', 'CONGO RIVER', 'TIGRIS', 'EUPHRATES', 'DELTA']
      },
      {
        title: 'Tropical Islands & Coral Atolls',
        words: ['BORA BORA', 'MALDIVES', 'FIJI REEF', 'HAWAII', 'TAHITI', 'SEYCHELLES', 'SANTORINI', 'BALI', 'GALAPAGOS', 'MADAGASCAR', 'CARIBBEAN', 'MAURITIUS', 'ATOLL', 'LAGOON', 'ARCHIPELAGO', 'PALM COVE']
      },
      {
        title: 'Wonders of the World',
        words: ['GREAT WALL', 'PETRA', 'COLOSSEUM', 'CHICHEN ITZA', 'MACHU PICCHU', 'TAJ MAHAL', 'CHRIST REDEEMER', 'PYRAMID GIZA', 'LIGHTHOUSE', 'HANGING GARDEN', 'ACROPOLIS', 'ANGKOR WAT', 'STONEHENGE']
      },
      {
        title: 'Deserts, Dunes & Canyons',
        words: ['SAHARA DESERT', 'GOBI DESERT', 'ATACAMA', 'MOJAVE', 'KALAHARI', 'GRAND CANYON', 'SAND DUNE', 'OASIS WATER', 'MIRAGE', 'BADLANDS', 'MONUMENT VALLEY', 'PLATEAU', 'EROSION', 'ARID LAND', 'CACTUS']
      },
      {
        title: 'Scandinavian Fjords & Wonders',
        words: ['NORWEGIAN FJORD', 'AURORA BOREALIS', 'GEYSIR', 'REYKJAVIK', 'STOCKHOLM', 'BERGEN', 'VIKING SHIP', 'GLACIER LAKE', 'MIDNIGHT SUN', 'TUNDRA', 'LOFOTEN', 'ARCHIPELAGO', 'ARCTIC CIRCLE', 'TROMSO']
      }
    ]
  },

  // -------------------------------------------------------------
  // 6. SCIENCE & DISCOVERY
  // -------------------------------------------------------------
  {
    id: 'science_discovery',
    name: 'Science & Discovery',
    category: 'Science & Cosmos',
    matchTerms: ['science', 'chemistry', 'physics', 'biology', 'discovery', 'laboratory', 'elements', 'genetics'],
    subtopics: [
      {
        title: 'The Periodic Table & Elements',
        words: ['HYDROGEN', 'HELIUM', 'CARBON', 'NITROGEN', 'OXYGEN', 'GOLD METAL', 'SILVER', 'PLATINUM', 'TITANIUM', 'URANIUM', 'NEON GAS', 'CHLORINE', 'POTASSIUM', 'CALCIUM', 'SODIUM', 'MAGNESIUM', 'ARGON']
      },
      {
        title: 'Genetics, DNA & Heredity',
        words: ['DOUBLE HELIX', 'CHROMOSOME', 'NUCLEOTIDE', 'GENOME', 'HEREDITY', 'MUTATION', 'DOMINANT', 'RECESSIVE', 'CELL NUCLEUS', 'RIBOSOME', 'ENZYME', 'PROTEIN SYNTHESIS', 'GENE THERAPY', 'TRAIT', 'CLONING']
      },
      {
        title: 'Quantum Physics & Relativity',
        words: ['QUANTUM', 'PHOTON', 'ELECTRON', 'HEISENBERG', 'SUPERPOSITION', 'ENTANGLEMENT', 'WAVE PARTICLE', 'UNCERTAINTY', 'EINSTEIN', 'SPACETIME', 'MASS ENERGY', 'QUARK', 'BOSON', 'HIGGS FIELD', 'HADRON']
      },
      {
        title: 'Earth Science, Volcanoes & Quakes',
        words: ['TECTONIC PLATE', 'VOLCANO', 'MAGMA CHAMBER', 'SEISMOLOGY', 'RICHTER SCALE', 'FAULT LINE', 'TSUNAMI', 'CONTINENTAL DRIFT', 'MANTLE', 'LAVA FLOW', 'GEYSER', 'SUBDUCTION', 'PANGEA', 'CRUST']
      },
      {
        title: 'Human Anatomy & Vital Organs',
        words: ['HEARTBEAT', 'LUNG CAPACITY', 'NEURON SYNAPSE', 'CEREBRUM', 'CIRCULATION', 'BLOOD VESSEL', 'ARTERY', 'SKELETON', 'MARROW', 'LIVER', 'KIDNEY', 'PANCREAS', 'DIAPHRAGM', 'VERTEBRAE', 'MUSCLE FIBER']
      },
      {
        title: 'Renewable Clean Energy',
        words: ['SOLAR CELL', 'WIND TURBINE', 'HYDROELECTRIC', 'GEOTHERMAL', 'PHOTOVOLTAIC', 'BATTERY STORAGE', 'GRID POWER', 'BIOMASS', 'EFFICIENCY', 'ZERO EMISSION', 'INVERTER', 'SUSTAINABILITY', 'KILOWATT']
      }
    ]
  },

  // -------------------------------------------------------------
  // 7. CLASSIC LITERATURE & THE ARTS
  // -------------------------------------------------------------
  {
    id: 'literature_arts',
    name: 'Classic Literature & Arts',
    category: 'Arts & Music',
    matchTerms: ['literature', 'books', 'art', 'arts', 'writing', 'poetry', 'novel', 'author', 'theater'],
    subtopics: [
      {
        title: 'Shakespearean Dramas & Comedies',
        words: ['HAMLET', 'MACBETH', 'ROMEO JULIET', 'OTHELLO', 'KING LEAR', 'MIDSUMMER', 'SOLILOQUY', 'PROSCENIUM', 'GLOBE THEATRE', 'SONNET', 'STRATFORD', 'PLAYWRIGHT', 'TRAGEDY', 'MONOLOGUE', 'STAGEPLAY']
      },
      {
        title: 'Classic Detective Mysteries',
        words: ['SHERLOCK HOLMES', 'WATSON', 'BAKER STREET', 'MAGNIFYING', 'HERCULE POIROT', 'MISS MARPLE', 'ALIBI', 'CRIME SCENE', 'FINGERPRINT', 'SLEUTH', 'INVESTIGATOR', 'SUSPECT', 'DEDUCTION', 'MYSTERY']
      },
      {
        title: 'Epic Fantasy & Quests',
        words: ['FELLOWSHIP', 'DRAGON LAIR', 'SPELLBOOK', 'SORCERER', 'ENCHANTED SWORD', 'LABYRINTH', 'CHRONICLE', 'EXCALIBUR', 'PROPHECY', 'KINGDOM', 'ELF REALM', 'DWARVEN FORGE', 'TALISMAN', 'MYTHOLOGY']
      },
      {
        title: 'Gothic Novels & Haunted Romances',
        words: ['FRANKENSTEIN', 'DRACULA', 'WUTHERING', 'JANE EYRE', 'MANOR HOUSE', 'COBWEB', 'CANDLELIGHT', 'SHADOWS', 'SECRET PASSAGE', 'GARGATTE', 'PHANTOM', 'SPECTER', 'MOORLAND', 'TURRET']
      },
      {
        title: 'Classic Poetry & Verse',
        words: ['STANZA', 'METAPHOR', 'ALLITERATION', 'RHYME SCHEME', 'IAMBIC', 'PENTAMETER', 'HAIKU', 'BALLAD', 'ODE TO AUTUMN', 'LYRIC', 'POET LAUREATE', 'EULOGY', 'VERSES', 'CADENCE', 'CANTO']
      }
    ]
  }
];

export const PRESET_COLLECTIONS: TopicPreset[] = [
  {
    id: 'american_history_preset',
    name: 'American History Chronicles',
    description: 'An immersive journey through the Revolutionary War, Civil War, Presidents, Space Race, Wild West, and Civil Rights.',
    topics: SEED_CLUSTERS.find(c => c.id === 'american_history')!.subtopics.map(s => ({
      title: s.title,
      words: s.words
    }))
  },
  {
    id: 'space_astronomy_preset',
    name: 'Space & Astronomy Odyssey',
    description: 'Exploration of planetary systems, lunar landings, distant nebulae, black holes, and stargazing.',
    topics: SEED_CLUSTERS.find(c => c.id === 'space_astronomy')!.subtopics.map(s => ({
      title: s.title,
      words: s.words
    }))
  },
  {
    id: 'nature_wildlife_preset',
    name: 'Nature & Wildlife Wonders',
    description: 'Vibrant puzzle journey across coral reefs, savannahs, rainforests, tundra, dinosaurs, and ancient trees.',
    topics: SEED_CLUSTERS.find(c => c.id === 'nature_wildlife')!.subtopics.map(s => ({
      title: s.title,
      words: s.words
    }))
  },
  {
    id: 'culinary_feast_preset',
    name: 'Gourmet Culinary Expedition',
    description: 'Artisan bakeries, Italian trattorias, sushi masters, French patisserie, and spices.',
    topics: SEED_CLUSTERS.find(c => c.id === 'food_culinary')!.subtopics.map(s => ({
      title: s.title,
      words: s.words
    }))
  },
  {
    id: 'world_geography_preset',
    name: 'World Explorer & Geography',
    description: 'Capitals of Europe, Asian megacities, mountain peaks, mighty rivers, and world wonders.',
    topics: SEED_CLUSTERS.find(c => c.id === 'world_geography')!.subtopics.map(s => ({
      title: s.title,
      words: s.words
    }))
  }
];

// Flat export of all topics for the library drawer
export const BUILT_IN_TOPICS: ThemedTopic[] = SEED_CLUSTERS.flatMap(cluster =>
  cluster.subtopics.map((sub, idx) => ({
    id: `${cluster.id}_${idx}`,
    category: cluster.category,
    title: sub.title,
    words: sub.words
  }))
);

/**
 * Resolves seed keywords into an array of distinct, themed subtopics!
 * Never prepends or appends the literal seed word to puzzle titles.
 * Produces clean, evocative, authentic chapter titles like:
 * "The Revolutionary War", "Presidents of the United States", "The Vietnam War Era",
 * "The Space Race & Moon Landing", "Manifest Destiny & Expansion", etc.
 */
export function resolveSeedToSubtopics(
  rawSeedText: string,
  targetCount: number
): { title: string; category: string; words: string[] }[] {
  // 1. If user provided custom format with colons ("Title: WORD1, WORD2, WORD3"):
  // Treat each explicit line as a direct puzzle definition.
  const lines = rawSeedText.split('\n').map(l => l.trim()).filter(Boolean);
  const explicitPuzzles: { title: string; category: string; words: string[] }[] = [];

  for (const line of lines) {
    if (line.includes(':')) {
      const [titlePart, wordsPart] = line.split(':');
      const words = wordsPart.split(/[,;|]/).map(w => w.trim()).filter(Boolean);
      if (titlePart.trim() && words.length >= 3) {
        explicitPuzzles.push({
          title: titlePart.trim(),
          category: 'Custom Topic',
          words
        });
      }
    }
  }

  if (explicitPuzzles.length >= targetCount) {
    return explicitPuzzles.slice(0, targetCount);
  }

  // 2. Parse seed keywords
  let rawKeywords = rawSeedText.trim();
  if (!rawKeywords) {
    rawKeywords = 'American History';
  }

  // Split by comma, semicolon, or newline
  const seedTokens = rawKeywords
    .split(/[\n,;]/)
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 0 && !t.includes(':'));

  const matchedSubtopics: { title: string; category: string; words: string[] }[] = [...explicitPuzzles];
  const matchedClusterIds = new Set<string>();

  for (const token of seedTokens) {
    let tokenMatched = false;

    // A. Check if token matches an entire Seed Cluster FIRST (e.g. "american history", "space", "nature", "food", "geography")
    for (const cluster of SEED_CLUSTERS) {
      const clusterNameLower = cluster.name.toLowerCase();
      const isMatch = cluster.matchTerms.some(term => token.includes(term) || term.includes(token)) ||
        clusterNameLower.includes(token) ||
        token.includes(clusterNameLower);

      if (isMatch && !matchedClusterIds.has(cluster.id)) {
        matchedClusterIds.add(cluster.id);
        cluster.subtopics.forEach(sub => {
          matchedSubtopics.push({
            title: sub.title,
            category: cluster.category,
            words: [...sub.words]
          });
        });
        tokenMatched = true;
      }
    }

    // B. If no cluster matched, check if token matches a specific Subtopic Title
    if (!tokenMatched) {
      for (const cluster of SEED_CLUSTERS) {
        for (const sub of cluster.subtopics) {
          const subTitleLower = sub.title.toLowerCase();
          if (subTitleLower.includes(token) || token.includes(subTitleLower)) {
            matchedSubtopics.push({
              title: sub.title,
              category: cluster.category,
              words: [...sub.words]
            });
            tokenMatched = true;
          }
        }
      }
    }

    // C. If the token was a custom keyword that did not match any built-in clusters or subtopics,
    // generate clean standalone titles that NEVER include the raw seed keyword in the title!
    if (!tokenMatched) {
      const genericSubs = generateCleanStandaloneSubtopics(token);
      genericSubs.forEach(s => matchedSubtopics.push(s));
    }
  }

  // Fallback if nothing matched
  if (matchedSubtopics.length === 0) {
    const defaultCluster = SEED_CLUSTERS[0];
    defaultCluster.subtopics.forEach(sub => {
      matchedSubtopics.push({
        title: sub.title,
        category: defaultCluster.category,
        words: [...sub.words]
      });
    });
  }

  // Deduplicate by title
  const uniqueList: { title: string; category: string; words: string[] }[] = [];
  const seenTitles = new Set<string>();

  for (const item of matchedSubtopics) {
    if (!seenTitles.has(item.title.toLowerCase())) {
      seenTitles.add(item.title.toLowerCase());
      uniqueList.push(item);
    }
  }

  // 3. If requested count is greater than available unique subtopics (up to 100),
  // expand ONLY within the current topic's domain so NO unrelated clusters ever leak in!
  if (uniqueList.length < targetCount && uniqueList.length > 0) {
    const ERA_SERIES = [
      'Pioneers & Icons',
      'Turning Points & Breakthroughs',
      'Decisive Moments',
      'Legends & Lore',
      'Mastery & Strategy',
      'The Golden Era',
      'Untold Chronicles',
      'The Modern Horizons',
      'Essential Foundations',
      'Great Discoveries'
    ];

    let baseIdx = 0;
    const initialLen = uniqueList.length;
    while (uniqueList.length < targetCount && baseIdx < 500) {
      const base = uniqueList[baseIdx % initialLen];
      const seriesTag = ERA_SERIES[Math.floor(baseIdx / initialLen) % ERA_SERIES.length];
      const newTitle = `${base.title}: ${seriesTag}`;

      if (!seenTitles.has(newTitle.toLowerCase())) {
        seenTitles.add(newTitle.toLowerCase());
        // Rotate words so placement patterns and word lists feel varied
        const offset = (baseIdx * 3) % Math.max(1, base.words.length);
        const rotatedWords = [...base.words.slice(offset), ...base.words.slice(0, offset)];
        uniqueList.push({
          title: newTitle,
          category: base.category,
          words: rotatedWords
        });
      }
      baseIdx++;
    }
  }

  return uniqueList.slice(0, targetCount);
}

/**
 * Generates clean, authentic standalone chapter titles for unknown custom seeds.
 * Crucially, NEVER appends or prepends the seed word itself to the titles!
 */
function generateCleanStandaloneSubtopics(seedKeyword: string): { title: string; category: string; words: string[] }[] {
  const capCategory = seedKeyword.charAt(0).toUpperCase() + seedKeyword.slice(1);

  const cleanStandaloneChapters = [
    {
      title: 'Pioneers & Trailblazers',
      words: ['CHAMPION', 'PIONEER', 'LEGEND', 'MASTER', 'INNOVATOR', 'VIRTUOSO', 'LEADER', 'EXPERTISE', 'MENTOR', 'EXCELLENCE', 'ACHIEVEMENT', 'VISIONARY', 'GUIDE', 'HONOR']
    },
    {
      title: 'Historic Milestones & Breakthroughs',
      words: ['ORIGINS', 'HERITAGE', 'FOUNDATIONS', 'DISCOVERY', 'CHRONICLE', 'MILESTONE', 'BEGINNING', 'TRADITION', 'ROOTS', 'ARCHIVE', 'CREATOR', 'ANCIENT', 'ERA', 'LEGACY']
    },
    {
      title: 'Techniques, Tactics & Mastery',
      words: ['TECHNIQUE', 'STRATEGY', 'TACTICS', 'PRECISION', 'EXECUTION', 'FINESSE', 'PROFICIENCY', 'METHOD', 'PRACTICE', 'DISCIPLINE', 'SKILLSET', 'ADVANCEMENT', 'AGILITY', 'CALCULATION']
    },
    {
      title: 'Essential Tools & Equipment',
      words: ['EQUIPMENT', 'INSTRUMENTS', 'HARDWARE', 'TOOLBOX', 'APPARATUS', 'GEAR', 'DEVICES', 'CRAFT', 'MATERIAL', 'IMPLEMENT', 'MECHANISM', 'PRECISION', 'WORKBENCH', 'ANVIL']
    },
    {
      title: 'Core Terminology & Fundamentals',
      words: ['TERMINOLOGY', 'VOCABULARY', 'GLOSSARY', 'SYNTAX', 'PARLANCE', 'LANGUAGE', 'DEFINITIONS', 'STANDARDS', 'CONCEPTS', 'PRINCIPLES', 'NOTATION', 'CODEWORD', 'INDEX', 'THEORY']
    },
    {
      title: 'Iconic Venues & Famous Landmarks',
      words: ['SANCTUARY', 'PAVILION', 'STADIUM', 'LANDSCAPE', 'CAPITAL', 'COLOSSEUM', 'CITADEL', 'DOMINION', 'HAVEN', 'FRONTIER', 'MONUMENT', 'TERRITORY', 'ARENA', 'AMPHITHEATER']
    },
    {
      title: 'Legends, Mysteries & Lore',
      words: ['MYSTERY', 'ENIGMA', 'LABYRINTH', 'CHRONICLES', 'REVELATION', 'CIPHER', 'TREASURE', 'ILLUMINATION', 'WISDOM', 'FOLKLORE', 'DISCOVERY', 'CONCEALED', 'ARTIFACT', 'PROPHECY']
    },
    {
      title: 'The Modern Era & New Horizons',
      words: ['INNOVATION', 'BREAKTHROUGH', 'REVOLUTION', 'MODERNITY', 'FRONTIER', 'FUTURE', 'SYNTHESIS', 'DISRUPTION', 'DEVELOPMENT', 'EVOLUTION', 'HORIZONS', 'VANGUARD', 'HORIZON', 'PROMISE']
    }
  ];

  return cleanStandaloneChapters.map(ch => ({
    title: ch.title,
    category: capCategory,
    words: ch.words
  }));
}
