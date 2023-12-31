const Mcc = [
  {name: 'A/C, Refrigeration Repair', number: '7623'},
  {name: 'Accounting/Bookkeeping Services', number: '8931'},
  {name: 'Advertising Services', number: '7311'},
  {name: 'Agricultural Cooperative', number: '0763'},
  {name: 'Airlines, Air Carriers', number: '4511'},
  {name: 'Airports, Flying Fields', number: '4582'},
  {name: 'Ambulance Services', number: '4119'},
  {name: 'Amusement Parks/Carnivals', number: '7996'},
  {name: 'Antique Reproductions', number: '5937'},
  {name: 'Antique Shops', number: '5932'},
  {name: 'Aquariums', number: '7998'},
  {name: 'Architectural/Surveying Services', number: '8911'},
  {name: 'Art Dealers and Galleries', number: '5971'},
  {name: 'Artists Supply and Craft Shops', number: '5970'},
  {name: 'Auto Body Repair Shops', number: '7531'},
  {name: 'Auto Paint Shops', number: '7535'},
  {name: 'Auto Service Shops', number: '7538'},
  {name: 'Auto and Home Supply Stores', number: '5531'},
  {name: 'Automated Cash Disburse', number: '6011'},
  {name: 'Automated Fuel Dispensers', number: '5542'},
  {name: 'Automobile Associations', number: '8675'},
  {name: 'Automotive Parts and Accessories Stores', number: '5533'},
  {name: 'Automotive Tire Stores', number: '5532'},
  {name: 'Bail and Bond Payments (payment to the surety for the bond, not the actual bond paid to the government agency)', number: '9223'},
  {name: 'Bakeries', number: '5462'},
  {name: 'Bands, Orchestras', number: '7929'},
  {name: 'Barber and Beauty Shops', number: '7230'},
  {name: 'Betting/Casino Gambling', number: '7995'},
  {name: 'Bicycle Shops', number: '5940'},
  {name: 'Billiard/Pool Establishments', number: '7932'},
  {name: 'Boat Dealers', number: '5551'},
  {name: 'Boat Rentals and Leases', number: '4457'},
  {name: 'Book Stores', number: '5942'},
  {name: 'Books, Periodicals, and Newspapers', number: '5192'},
  {name: 'Bowling Alleys', number: '7933'},
  {name: 'Bus Lines', number: '4131'},
  {name: 'Business/Secretarial Schools', number: '8244'},
  {name: 'Buying/Shopping Services', number: '7278'},
  {name: 'Cable, Satellite, and Other Pay Television and Radio', number: '4899'},
  {name: 'Camera and Photographic Supply Stores', number: '5946'},
  {name: 'Candy, Nut, and Confectionery Stores', number: '5441'},
  {name: 'Car Rental Agencies', number: '7512'},
  {name: 'Car Washes', number: '7542'},
  {name: 'Car and Truck Dealers (New & Used) Sales, Service, Repairs Parts and Leasing', number: '5511'},
  {name: 'Car and Truck Dealers (Used Only) Sales, Service, Repairs Parts and Leasing', number: '5521'},
  {name: 'Carpentry Services', number: '1750'},
  {name: 'Carpet/Upholstery Cleaning', number: '7217'},
  {name: 'Caterers', number: '5811'},
  {name: 'Charitable and Social Service Organizations - Fundraising', number: '8398'},
  {name: 'Chemicals and Allied Products (Not Elsewhere Classified)', number: '5169'},
  {name: 'Child Care Services', number: '8351'},
  {name: 'Childrens and Infants Wear Stores', number: '5641'},
  {name: 'Chiropodists, Podiatrists', number: '8049'},
  {name: 'Chiropractors', number: '8041'},
  {name: 'Cigar Stores and Stands', number: '5993'},
  {name: 'Civic, Social, Fraternal Associations', number: '8641'},
  {name: 'Cleaning and Maintenance', number: '7349'},
  {name: 'Clothing Rental', number: '7296'},
  {name: 'Colleges, Universities', number: '8220'},
  {name: 'Commercial Equipment (Not Elsewhere Classified)', number: '5046'},
  {name: 'Commercial Footwear', number: '5139'},
  {name: 'Commercial Photography, Art and Graphics', number: '7333'},
  {name: 'Commuter Transport, Ferries', number: '4111'},
  {name: 'Computer Network Services', number: '4816'},
  {name: 'Computer Programming', number: '7372'},
  {name: 'Computer Repair', number: '7379'},
  {name: 'Computer Software Stores', number: '5734'},
  {name: 'Computers, Peripherals, and Software', number: '5045'},
  {name: 'Concrete Work Services', number: '1771'},
  {name: 'Construction Materials (Not Elsewhere Classified)', number: '5039'},
  {name: 'Consulting, Public Relations', number: '7392'},
  {name: 'Correspondence Schools', number: '8241'},
  {name: 'Cosmetic Stores', number: '5977'},
  {name: 'Counseling Services', number: '7277'},
  {name: 'Country Clubs', number: '7997'},
  {name: 'Courier Services', number: '4215'},
  {name: 'Court Costs, Including Alimony and Child Support - Courts of Law', number: '9211'},
  {name: 'Credit Reporting Agencies', number: '7321'},
  {name: 'Cruise Lines', number: '4411'},
  {name: 'Dairy Products Stores', number: '5451'},
  {name: 'Dance Hall, Studios, Schools', number: '7911'},
  {name: 'Dating/Escort Services', number: '7273'},
  {name: 'Dentists, Orthodontists', number: '8021'},
  {name: 'Department Stores', number: '5311'},
  {name: 'Detective Agencies', number: '7393'},
  {name: 'Digital Goods Media – Books, Movies, Music', number: '5815'},
  {name: 'Digital Goods – Applications (Excludes Games)', number: '5817'},
  {name: 'Digital Goods – Games', number: '5816'},
  {name: 'Digital Goods – Large Digital Goods Merchant', number: '5818'},
  {name: 'Direct Marketing - Catalog Merchant', number: '5964'},
  {name: 'Direct Marketing - Combination Catalog and Retail Merchant', number: '5965'},
  {name: 'Direct Marketing - Inbound Telemarketing', number: '5967'},
  {name: 'Direct Marketing - Insurance Services', number: '5960'},
  {name: 'Direct Marketing - Other', number: '5969'},
  {name: 'Direct Marketing - Outbound Telemarketing', number: '5966'},
  {name: 'Direct Marketing - Subscription', number: '5968'},
  {name: 'Direct Marketing - Travel', number: '5962'},
  {name: 'Discount Stores', number: '5310'},
  {name: 'Doctors', number: '8011'},
  {name: 'Door-To-Door Sales', number: '5963'},
  {name: 'Drapery, Window Covering, and Upholstery Stores', number: '5714'},
  {name: 'Drinking Places', number: '5813'},
  {name: 'Drug Stores and Pharmacies', number: '5912'},
  {name: 'Drugs, Drug Proprietaries, and Druggist Sundries', number: '5122'},
  {name: 'Dry Cleaners', number: '7216'},
  {name: 'Durable Goods (Not Elsewhere Classified)', number: '5099'},
  {name: 'Duty Free Stores', number: '5309'},
  {name: 'Eating Places, Restaurants', number: '5812'},
  {name: 'Educational Services', number: '8299'},
  {name: 'Electric Razor Stores', number: '5997'},
  {name: 'Electrical Parts and Equipment', number: '5065'},
  {name: 'Electrical Services', number: '1731'},
  {name: 'Electronics Repair Shops', number: '7622'},
  {name: 'Electronics Stores', number: '5732'},
  {name: 'Elementary, Secondary Schools', number: '8211'},
  {name: 'Employment/Temp Agencies', number: '7361'},
  {name: 'Equipment Rental', number: '7394'},
  {name: 'Exterminating Services', number: '7342'},
  {name: 'Family Clothing Stores', number: '5651'},
  {name: 'Fast Food Restaurants', number: '5814'},
  {name: 'Financial Institutions', number: '6012'},
  {name: 'Fines - Government Administrative Entities', number: '9222'},
  {name: 'Fireplace, Fireplace Screens, and Accessories Stores', number: '5718'},
  {name: 'Floor Covering Stores', number: '5713'},
  {name: 'Florists', number: '5992'},
  {name: 'Florists Supplies, Nursery Stock, and Flowers', number: '5193'},
  {name: 'Freezer and Locker Meat Provisioners', number: '5422'},
  {name: 'Fuel Dealers (Non Automotive)', number: '5983'},
  {name: 'Funeral Services, Crematories', number: '7261'},
  {name: 'Furniture Repair, Refinishing', number: '7641'},
  {name: 'Furniture, Home Furnishings, and Equipment Stores, Except Appliances', number: '5712'},
  {name: 'Furriers and Fur Shops', number: '5681'},
  {name: 'General Services', number: '1520'},
  {name: 'Gift, Card, Novelty, and Souvenir Shops', number: '5947'},
  {name: 'Glass, Paint, and Wallpaper Stores', number: '5231'},
  {name: 'Glassware, Crystal Stores', number: '5950'},
  {name: 'Golf Courses - Public', number: '7992'},
  {name: 'Government Services (Not Elsewhere Classified)', number: '9399'},
  {name: 'Grocery Stores, Supermarkets', number: '5411'},
  {name: 'Hardware Stores', number: '5251'},
  {name: 'Hardware, Equipment, and Supplies', number: '5072'},
  {name: 'Health and Beauty Spas', number: '7298'},
  {name: 'Hearing Aids Sales and Supplies', number: '5975'},
  {name: 'Heating, Plumbing, A/C', number: '1711'},
  {name: 'Hobby, Toy, and Game Shops', number: '5945'},
  {name: 'Home Supply Warehouse Stores', number: '5200'},
  {name: 'Hospitals', number: '8062'},
  {name: 'Hotels, Motels, and Resorts', number: '7011'},
  {name: 'Household Appliance Stores', number: '5722'},
  {name: 'Industrial Supplies (Not Elsewhere Classified)', number: '5085'},
  {name: 'Information Retrieval Services', number: '7375'},
  {name: 'Insurance - Default', number: '6399'},
  {name: 'Insurance Underwriting, Premiums', number: '6300'},
  {name: 'Intra-Company Purchases', number: '9950'},
  {name: 'Jewelry Stores, Watches, Clocks, and Silverware Stores', number: '5944'},
  {name: 'Landscaping Services', number: '0780'},
  {name: 'Laundries', number: '7211'},
  {name: 'Laundry, Cleaning Services', number: '7210'},
  {name: 'Legal Services, Attorneys', number: '8111'},
  {name: 'Luggage and Leather Goods Stores', number: '5948'},
  {name: 'Lumber, Building Materials Stores', number: '5211'},
  {name: 'Manual Cash Disburse', number: '6010'},
  {name: 'Marinas, Service and Supplies', number: '4468'},
  {name: 'Masonry, Stonework, and Plaster', number: '1740'},
  {name: 'Massage Parlors', number: '7297'},
  {name: 'Medical Services', number: '8099'},
  {name: 'Medical and Dental Labs', number: '8071'},
  {name: 'Medical, Dental, Ophthalmic, and Hospital Equipment and Supplies', number: '5047'},
  {name: 'Membership Organizations', number: '8699'},
  {name: 'Mens and Boys Clothing and Accessories Stores', number: '5611'},
  {name: 'Mens, Womens Clothing Stores', number: '5691'},
  {name: 'Metal Service Centers', number: '5051'},
  {name: 'Miscellaneous Apparel and Accessory Shops', number: '5699'},
  {name: 'Miscellaneous Auto Dealers', number: '5599'},
  {name: 'Miscellaneous Business Services', number: '7399'},
  {name: 'Miscellaneous Food Stores - Convenience Stores and Specialty Markets', number: '5499'},
  {name: 'Miscellaneous General Merchandise', number: '5399'},
  {name: 'Miscellaneous General Services', number: '7299'},
  {name: 'Miscellaneous Home Furnishing Specialty Stores', number: '5719'},
  {name: 'Miscellaneous Publishing and Printing', number: '2741'},
  {name: 'Miscellaneous Recreation Services', number: '7999'},
  {name: 'Miscellaneous Repair Shops', number: '7699'},
  {name: 'Miscellaneous Specialty Retail', number: '5999'},
  {name: 'Mobile Home Dealers', number: '5271'},
  {name: 'Motion Picture Theaters', number: '7832'},
  {name: 'Motor Freight Carriers and Trucking - Local and Long Distance, Moving and Storage Companies, and Local Delivery Services', number: '4214'},
  {name: 'Motor Homes Dealers', number: '5592'},
  {name: 'Motor Vehicle Supplies and New Parts', number: '5013'},
  {name: 'Motorcycle Shops and Dealers', number: '5571'},
  {name: 'Motorcycle Shops, Dealers', number: '5561'},
  {name: 'Music Stores-Musical Instruments, Pianos, and Sheet Music', number: '5733'},
  {name: 'News Dealers and Newsstands', number: '5994'},
  {name: 'Non-FI, Money Orders', number: '6051'},
  {name: 'Non-FI, Stored Value Card Purchase/Load', number: '6540'},
  {name: 'Nondurable Goods (Not Elsewhere Classified)', number: '5199'},
  {name: 'Nurseries, Lawn and Garden Supply Stores', number: '5261'},
  {name: 'Nursing/Personal Care', number: '8050'},
  {name: 'Office and Commercial Furniture', number: '5021'},
  {name: 'Opticians, Eyeglasses', number: '8043'},
  {name: 'Optometrists, Ophthalmologist', number: '8042'},
  {name: 'Orthopedic Goods - Prosthetic Devices', number: '5976'},
  {name: 'Osteopaths', number: '8031'},
  {name: 'Package Stores-Beer, Wine, and Liquor', number: '5921'},
  {name: 'Paints, Varnishes, and Supplies', number: '5198'},
  {name: 'Parking Lots, Garages', number: '7523'},
  {name: 'Passenger Railways', number: '4112'},
  {name: 'Pawn Shops', number: '5933'},
  {name: 'Pet Shops, Pet Food, and Supplies', number: '5995'},
  {name: 'Petroleum and Petroleum Products', number: '5172'},
  {name: 'Photo Developing', number: '7395'},
  {name: 'Photographic Studios', number: '7221'},
  {name: 'Photographic, Photocopy, Microfilm Equipment, and Supplies', number: '5044'},
  {name: 'Picture/Video Production', number: '7829'},
  {name: 'Piece Goods, Notions, and Other Dry Goods', number: '5131'},
  {name: 'Plumbing, Heating Equipment, and Supplies', number: '5074'},
  {name: 'Political Organizations', number: '8651'},
  {name: 'Postal Services - Government Only', number: '9402'},
  {name: 'Precious Stones and Metals, Watches and Jewelry', number: '5094'},
  {name: 'Professional Services', number: '8999'},
  {name: 'Public Warehousing and Storage - Farm Products, Refrigerated Goods, Household Goods, and Storage', number: '4225'},
  {name: 'Quick Copy, Repro, and Blueprint', number: '7338'},
  {name: 'Railroads', number: '4011'},
  {name: 'Real Estate Agents and Managers - Rentals', number: '6513'},
  {name: 'Record Stores', number: '5735'},
  {name: 'Recreational Vehicle Rentals', number: '7519'},
  {name: 'Religious Goods Stores', number: '5973'},
  {name: 'Religious Organizations', number: '8661'},
  {name: 'Roofing/Siding, Sheet Metal', number: '1761'},
  {name: 'Secretarial Support Services', number: '7339'},
  {name: 'Security Brokers/Dealers', number: '6211'},
  {name: 'Service Stations', number: '5541'},
  {name: 'Sewing, Needlework, Fabric, and Piece Goods Stores', number: '5949'},
  {name: 'Shoe Repair/Hat Cleaning', number: '7251'},
  {name: 'Shoe Stores', number: '5661'},
  {name: 'Small Appliance Repair', number: '7629'},
  {name: 'Snowmobile Dealers', number: '5598'},
  {name: 'Special Trade Services', number: '1799'},
  {name: 'Specialty Cleaning', number: '2842'},
  {name: 'Sporting Goods Stores', number: '5941'},
  {name: 'Sporting/Recreation Camps', number: '7032'},
  {name: 'Sports Clubs/Fields', number: '7941'},
  {name: 'Sports and Riding Apparel Stores', number: '5655'},
  {name: 'Stamp and Coin Stores', number: '5972'},
  {name: 'Stationary, Office Supplies, Printing and Writing Paper', number: '5111'},
  {name: 'Stationery Stores, Office, and School Supply Stores', number: '5943'},
  {name: 'Swimming Pools Sales', number: '5996'},
  {name: 'TUI Travel - Germany', number: '4723'},
  {name: 'Tailors, Alterations', number: '5697'},
  {name: 'Tax Payments - Government Agencies', number: '9311'},
  {name: 'Tax Preparation Services', number: '7276'},
  {name: 'Taxicabs/Limousines', number: '4121'},
  {name: 'Telecommunication Equipment and Telephone Sales', number: '4812'},
  {name: 'Telecommunication Services', number: '4814'},
  {name: 'Telegraph Services', number: '4821'},
  {name: 'Tent and Awning Shops', number: '5998'},
  {name: 'Testing Laboratories', number: '8734'},
  {name: 'Theatrical Ticket Agencies', number: '7922'},
  {name: 'Timeshares	701', number: '7012'},
  {name: 'Tire Retreading and Repair', number: '7534'},
  {name: 'Tolls/Bridge Fees', number: '4784'},
  {name: 'Tourist Attractions and Exhibits', number: '7991'},
  {name: 'Towing Services', number: '7549'},
  {name: 'Trailer Parks, Campgrounds', number: '7033'},
  {name: 'Transportation Services (Not Elsewhere Classified)', number: '4789'},
  {name: 'Travel Agencies, Tour Operators', number: '4722'},
  {name: 'Truck StopIteration', number: '7511'},
  {name: 'Truck/Utility Trailer Rentals', number: '7513'},
  {name: 'Typesetting, Plate Making, and Related Services', number: '2791'},
  {name: 'Typewriter Stores', number: '5978'},
  {name: 'U.S. Federal Government Agencies or Departments', number: '9405'},
  {name: 'Uniforms, Commercial Clothing', number: '5137'},
  {name: 'Used Merchandise and Secondhand Stores', number: '5931'},
  {name: 'Utilities', number: '4900'},
  {name: 'Variety Stores', number: '5331'},
  {name: 'Veterinary Services', number: '0742'},
  {name: 'Video Amusement Game Supplies', number: '7993'},
  {name: 'Video Game Arcades', number: '7994'},
  {name: 'Video Tape Rental Stores', number: '7841'},
  {name: 'Vocational/Trade Schools', number: '8249'},
  {name: 'Watch/Jewelry Repair', number: '7631'},
  {name: 'Welding Repair', number: '7692'},
  {name: 'Wholesale Clubs', number: '5300'},
  {name: 'Wig and Toupee Stores', number: '5698'},
  {name: 'Wires, Money Orders', number: '4829'},
  {name: 'Womens Accessory and Specialty Shops', number: '5631'},
  {name: 'Womens Ready-To-Wear Stores', number: '5621'},
  {name: 'Wrecking and Salvage Yards', number: '5935'},
];

export default Mcc;
