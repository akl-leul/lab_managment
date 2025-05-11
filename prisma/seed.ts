import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
 const equipments = [
  {
    name: 'Microscope',
    description: 'Optical instrument used for viewing very small objects',
    quantity: 15,
    status: 'Available',
    category: 'Optics',
  },
  {
    name: 'Test Tube',
    description: 'Glass tube used to hold small amounts of material for laboratory testing',
    quantity: 100,
    status: 'Available',
    category: 'Glassware',
  },
  {
    name: 'Beaker',
    description: 'Cylindrical container used to mix, heat, and measure liquids',
    quantity: 50,
    status: 'Available',
    category: 'Glassware',
  },
  {
    name: 'Bunsen Burner',
    description: 'Gas burner used for heating and sterilization',
    quantity: 20,
    status: 'Available',
    category: 'Heating',
  },
  {
    name: 'Voltmeter',
    description: 'Device used to measure electric potential difference',
    quantity: 10,
    status: 'Available',
    category: 'Electrical',
  },
  {
    name: 'Thermometer',
    description: 'Instrument for measuring temperature',
    quantity: 30,
    status: 'Available',
    category: 'Measurement',
  },
  {
    name: 'Centrifuge',
    description: 'Machine used to separate fluids by density',
    quantity: 5,
    status: 'Available',
    category: 'Machinery',
  },
  {
    name: 'Oscilloscope',
    description: 'Device used to view varying signal voltages',
    quantity: 8,
    status: 'Available',
    category: 'Electrical',
  },
  {
    name: 'Spectrometer',
    description: 'Instrument used to measure properties of light',
    quantity: 7,
    status: 'Available',
    category: 'Optics',
  },
  // Additional equipment
  {
    name: 'pH Meter',
    description: 'Instrument used to measure the acidity or alkalinity of a solution',
    quantity: 12,
    status: 'Available',
    category: 'Measurement',
  },
  {
    name: 'Magnetic Stirrer',
    description: 'Device used for stirring solutions using a rotating magnetic field',
    quantity: 10,
    status: 'Available',
    category: 'Mixing',
  },
  {
    name: 'Autoclave',
    description: 'Equipment used to sterilize instruments and media using high-pressure steam',
    quantity: 3,
    status: 'Available',
    category: 'Sterilization',
  },
  {
    name: 'Water Bath',
    description: 'Device used to incubate samples in a controlled water temperature',
    quantity: 6,
    status: 'Available',
    category: 'Heating',
  },
  {
    name: 'Analytical Balance',
    description: 'Precision instrument used for measuring mass',
    quantity: 4,
    status: 'Available',
    category: 'Measurement',
  },
  {
    name: 'Micropipette',
    description: 'Tool used for accurately measuring and transferring small volumes of liquid',
    quantity: 25,
    status: 'Available',
    category: 'Glassware',
  },
  {
    name: 'Incubator',
    description: 'Device used to maintain controlled environmental conditions for cell or bacterial cultures',
    quantity: 5,
    status: 'Available',
    category: 'Culturing',
  },
  {
    name: 'Fume Hood',
    description: 'Ventilated enclosure to safely work with hazardous fumes and vapors',
    quantity: 2,
    status: 'Available',
    category: 'Safety',
  },
  {
    name: 'Petri Dish',
    description: 'Shallow cylindrical lidded dish used to culture cells or bacteria',
    quantity: 200,
    status: 'Available',
    category: 'Glassware',
  },
  {
    name: 'Forceps',
    description: 'Instrument used for grasping and holding objects',
    quantity: 30,
    status: 'Available',
    category: 'Tools',
  },
  {
    name: 'Crucible',
    description: 'Container used for heating substances to very high temperatures',
    quantity: 15,
    status: 'Available',
    category: 'Heating',
  },
];

  for (const equipment of equipments) {
    await prisma.equipment.upsert({
      where: { name: equipment.name }, // now valid if @unique on name
      update: {}, // do nothing if exists
      create: equipment,
    });
  }

  console.log('10 equipment records have been seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

 