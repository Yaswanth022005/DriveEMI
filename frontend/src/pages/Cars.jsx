import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Example car data (20 popular models, images from Wikipedia or manufacturer sites)
const cars = [
  {
    name: "Maruti Suzuki Swift",
    price: 650000,
    img: "https://images.unsplash.com/photo-1663852397535-18292e115327?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFydXRpJTIwc3V6dWtpfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  },
  {
    name: "Hyundai Creta",
    price: 1100000,
    img: "https://images.unsplash.com/photo-1748214547184-d994bfe53322?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aHl1bmRhaSUyMGNyZXRhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  },
  {
    name: "Tata Nexon",
    price: 900000,
    img: "https://img.autocarindia.com/ExtraImages/20240327034719_Nexon%20Base%20Model%20Web%20Resized.001.jpeg?w=700&c=1",
  },
  {
    name: "Kia Seltos",
    price: 1200000,
    img: "https://images.unsplash.com/photo-1658827049990-c03c2519cc4c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8S2lhJTIwU2VsdG9zfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  },
  {
    name: "Mahindra Thar",
    price: 1500000,
    img: "https://images.unsplash.com/photo-1633867179970-c54688bcfa33?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TWFoaW5kcmElMjBUaGFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  },
  {
    name: "Honda City",
    price: 1200000,
    img: "https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SG9uZGElMjBDaXR5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  },
  {
    name: "Toyota Fortuner",
    price: 3500000,
    img: "https://images.unsplash.com/photo-1664783856972-ac9922d7b2d3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwZm9ydHVuZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900",
  },
  {
    name: "MG Hector",
    price: 1700000,
    img: "https://stimg.cardekho.com/images/carexteriorimages/630x420/MG/Hector/10949/1755845009584/front-left-side-47.jpg?tr=w-664",
  },
  {
    name: "Renault Kwid",
    price: 500000,
    img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/141125/kwid-exterior-right-front-three-quarter-37.jpeg?isig=0&q=80",
  },
  {
    name: "Volkswagen Polo",
    price: 800000,
    img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/29628/polo-exterior-right-front-three-quarter-2.jpeg?q=80",
  },
  {
    name: "Skoda Octavia",
    price: 2700000,
    img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/40371/octavia-exterior-right-front-three-quarter-2.jpeg?q=80",
  },
  {
    name: "Ford EcoSport",
    price: 950000,
    img: "https://imgd.aeplcdn.com/664x374/cw/ec/40369/Ford-EcoSport-Right-Front-Three-Quarter-159249.jpg?wm=0&q=80",
  },
  {
    name: "Maruti Suzuki Baleno",
    price: 800000,
    img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/102663/baleno-exterior-right-front-three-quarter-72.png?isig=0&q=80",
  },
  {
    name: "Hyundai Venue",
    price: 1000000,
    img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/141113/venue-exterior-right-front-three-quarter-16.jpeg?isig=0&q=80",
  },
  {
    name: "Tata Harrier",
    price: 1700000,
    img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/139139/harrier-exterior-right-front-three-quarter-6.jpeg?isig=0&q=80",
  },
  {
    name: "Kia Sonet",
    price: 900000,
    img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/174423/sonet-exterior-right-front-three-quarter-11.jpeg?isig=0&q=80",
  },
  {
    name: "Mahindra XUV700",
    price: 2000000,
    img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter-5.png?isig=0&q=80",
  },
  {
    name: "Honda Amaze",
    price: 700000,
    img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/184377/amaze-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80",
  },
  {
    name: "Toyota Innova Crysta",
    price: 2500000,
    img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/140809/innova-crysta-exterior-right-front-three-quarter-2.png?isig=0&q=80",
  },
  {
    name: "MG ZS EV",
    price: 2300000,
    img: "https://imgd.aeplcdn.com/664x374/n/cw/ec/110437/zs-ev-exterior-right-front-three-quarter-69.jpeg?isig=0&q=80",
  },
];

export default function Cars() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  function handleCalculate(car) {
    // Pass car price to calculator page via state
    navigate('/calculator', { state: { carPrice: car.price, carName: car.name } })
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">All Cars in India</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {cars.map(car => (
          <div key={car.name} className="card bg-base-100 shadow-xl">
            <figure className="px-4 pt-4">
              <img src={car.img} alt={car.name} className="rounded-xl h-40 object-cover w-full" loading="lazy"
               />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title text-lg font-semibold">{car.name}</h2>
              <p className="text-blue-700 font-bold">₹{car.price.toLocaleString()}</p>
              <button className="btn btn-primary mt-2" onClick={() => handleCalculate(car)}>
                Calculate EMI & Down Payment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
