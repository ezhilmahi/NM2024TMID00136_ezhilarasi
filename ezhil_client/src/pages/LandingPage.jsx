import React, { useContext, useEffect, useState } from 'react'
import '../styles/LandingPage.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContext';

const LandingPage = () => {

  const [error, setError] = useState('');
  const [checkBox, setCheckBox] = useState(false);


  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState();
  const [returnDate, setReturnDate] = useState();



  const navigate = useNavigate();
  useEffect(()=>{
    
    if(localStorage.getItem('userType') === 'admin'){
      navigate('/admin');
    } else if(localStorage.getItem('userType') === 'flight-operator'){
      navigate('/flight-admin');
    }
  }, []);

  const [Flights, setFlights] = useState([]);

  const fetchFlights = async () =>{

    if(checkBox){
      if(departure !== "" && destination !== "" && departureDate && returnDate){
        const date = new Date();
        const date1 = new Date(departureDate);
        const date2 = new Date(returnDate);
        if(date1 > date && date2 > date1){
          setError("");
          await axios.get('http://localhost:6001/fetch-flights').then(
              (response)=>{
                setFlights(response.data);
                console.log(response.data)
              }
           )
        } else{ setError("Please check the dates"); }
      } else{ setError("Please fill all the inputs"); }
    }else{
      if(departure !== "" && destination !== "" && departureDate){
        const date = new Date();
        const date1 = new Date(departureDate);
        if(date1 >= date){
          setError("");
          await axios.get('http://localhost:6001/fetch-flights').then(
              (response)=>{
                setFlights(response.data);
                console.log(response.data)
              }
           )
        } else{ setError("Please check the dates"); }      
      } else{ setError("Please fill all the inputs"); }
    }
    }
    const {setTicketBookingDate} = useContext(GeneralContext);
    const userId = localStorage.getItem('userId');


    const handleTicketBooking = async (id, origin, destination) =>{
      if(userId){

          if(origin === departure){
            setTicketBookingDate(departureDate);
            navigate(`/book-flight/${id}`);
          } else if(destination === departure){
            setTicketBookingDate(returnDate);
            navigate(`/book-flight/${id}`);
          }
      }else{
        navigate('/auth');
      }
    }



  return (
    <div className="landingPage">
        <div className="landingHero">


          <div className="landingHero-title">
          <h1 className="banner-h1">WINGS OF ADVENTURE</h1>
<p className="banner-p">Book your next escape and take off to new destinations where every flight opens the door to unforgettable experiences.</p>

          </div>

          

          <div className="Flight-search-container input-container mb-4">

                  {/* <h3>Journey details</h3> */}
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" value="" onChange={(e)=>setCheckBox(e.target.checked)} />
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Return journey</label>
                  </div>
                  <div className='Flight-search-container-body'>

                    <div className="form-floating">
                      <select className="form-select form-select-sm mb-3"  aria-label=".form-select-sm example" value={departure} onChange={(e)=>setDeparture(e.target.value)}>
                        <option value="" selected disabled>Select</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Banglore">Banglore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Pune">Pune</option>
                        <option value="Trivendrum">Trivendrum</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="varanasi">varanasi</option>
                        <option value="Jaipur">Jaipur</option>
                      </select>
                      <label htmlFor="floatingSelect">Departure City</label>
                    </div>
                    <div className="form-floating">
                      <select className="form-select form-select-sm mb-3"  aria-label=".form-select-sm example" value={destination} onChange={(e)=>setDestination(e.target.value)}>
                        <option value="" selected disabled>Select</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Banglore">Banglore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Indore">Indore</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Pune">Pune</option>
                        <option value="Trivendrum">Trivendrum</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="varanasi">varanasi</option>
                        <option value="Jaipur">Jaipur</option>
                      </select>
                      <label htmlFor="floatingSelect">Destination City</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input type="date" className="form-control" id="floatingInputstartDate" value={departureDate} onChange={(e)=>setDepartureDate(e.target.value)}/>
                      <label htmlFor="floatingInputstartDate">Journey date</label>
                    </div>
                    {checkBox ?
                    
                      <div className="form-floating mb-3">
                        <input type="date" className="form-control" id="floatingInputreturnDate" value={returnDate} onChange={(e)=>setReturnDate(e.target.value)}/>
                        <label htmlFor="floatingInputreturnDate">Return date</label>
                      </div>
                    
                    :
                    
                    ""}
                    <div>
                      <button className="btn btn-primary" onClick={fetchFlights}>Search</button>
                    </div>

                  </div>
                  <p>{error}</p>
              </div>
                  
                {Flights.length > 0 
                ?
                <>
                {
                  Flights.filter(Flight => Flight.origin === departure && Flight.destination === destination).length > 0 ? 
                  <>
                  <div className="availableFlightsContainer">
                    <h1>Available Flights</h1>

                    <div className="Flights">

                      {checkBox ?
                      
                      <>
                        {Flights.filter(Flight => (Flight.origin === departure && Flight.destination === destination ) || (Flight.origin === destination && Flight.destination === departure)).map((Flight)=>{
                        return(

                        <div className="Flight" key={Flight._id}>
                            <div>
                                <p> <b>{Flight.flightName}</b></p>
                                <p ><b>Flight Number:</b> {Flight.flightId}</p>
                            </div>
                            <div>
                                <p ><b>Start :</b> {Flight.origin}</p>
                                <p ><b>Departure Time:</b> {Flight.departureTime}</p>
                            </div>
                            <div>
                                <p ><b>Destination :</b> {Flight.destination}</p>
                                <p ><b>Arrival Time:</b> {Flight.arrivalTime}</p>
                            </div>
                            <div>
                                <p ><b>Starting Price:</b> {Flight.basePrice}</p>
                                <p ><b>Available Seats:</b> {Flight.totalSeats}</p>
                            </div>
                            <button className="button btn btn-primary" onClick={()=>handleTicketBooking(Flight._id, Flight.origin, Flight.destination)}>Book Now</button>
                        </div>
                        )
                      })}
                      </>
                      :
                      <>
                      {Flights.filter(Flight => Flight.origin === departure && Flight.destination === destination).map((Flight)=>{
                        return(

                        <div className="Flight">
                            <div>
                                <p> <b>{Flight.flightName}</b></p>
                                <p ><b>Flight Number:</b> {Flight.flightId}</p>
                            </div>
                            <div>
                                <p ><b>Start :</b> {Flight.origin}</p>
                                <p ><b>Departure Time:</b> {Flight.departureTime}</p>
                            </div>
                            <div>
                                <p ><b>Destination :</b> {Flight.destination}</p>
                                <p ><b>Arrival Time:</b> {Flight.arrivalTime}</p>
                            </div>
                            <div>
                                <p ><b>Starting Price:</b> {Flight.basePrice}</p>
                                <p ><b>Available Seats:</b> {Flight.totalSeats}</p>
                            </div>
                            <button className="button btn btn-primary" onClick={()=>handleTicketBooking(Flight._id, Flight.origin, Flight.destination)}>Book Now</button>
                        </div>
                        )
                      })}
                      </>}

                      

                    </div>
                  </div>
                  </>
                  :
                  <>
                   <div className="availableFlightsContainer">
                    <h1> No Flights</h1>
                    </div>
                  </>
                }
                </>
                :
                <></>
                }
         
                
                  
   






        </div>
        <section id="about" className="section-about  p-4">
        <div className="container">
            <h2 className="section-title">About Us</h2>
            <p className="section-description">
    &nbsp; &nbsp;&nbsp; &nbsp; Welcome to our Flight Booking App, where your travel experience is our top priority. Whether you're booking a quick business trip, planning an exciting vacation, or simply seeking a scenic getaway, our app offers a wide range of flights to fit your unique travel needs.
</p>
<p className="section-description">
    &nbsp; &nbsp;&nbsp; &nbsp; We know that convenience and efficiency matter. Our easy-to-use interface allows you to browse flight options, compare prices, and choose your preferred seats—all in just a few clicks. With personalized features, you can select departure times, window seats, or even special accommodations to ensure your journey is tailored to you.
</p>
<p className="section-description">
    &nbsp; &nbsp;&nbsp; &nbsp; Let us help you explore new destinations, experience breathtaking views, and create lasting memories. Start your adventure today with our trusted flight booking app—designed for comfort, reliability, and the joy of travel. Your next flight is just a tap away!
</p>


            <span><h5>2024 High FlightConnect - &copy; All rights reserved</h5></span>

        </div>
    </section>
    </div>
  )
}

export default LandingPage