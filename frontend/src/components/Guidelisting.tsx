
import React, { useEffect, useState } from "react";
import "./SearchPage.css";
import SearchResult from "./SearchResult";
import skardu from '/skardu.jpg'
import UpdateDelete from "./UpdateDelete";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import TravelGuideBooking from "./TravelGuideBooking";

function SearchPage() {

  const navigate = useNavigate()
  const [recommended, setRecommended] = useState<boolean>(true)
  const [highRated, setHighRated] = useState<boolean>(false)
  const [lowPrice, setLowPrice] = useState<boolean>(false)


  const handleClickRecommended = () => {
    setRecommended(true)
    setHighRated(false)
    setLowPrice(false)
  }
  const handleClickHighRated = () => {
    setRecommended(false)
    setHighRated(true)
    setLowPrice(false)
  }
  const handleClickLowPrice = () => {
    setRecommended(false)
    setHighRated(false)
    setLowPrice(true)
  }

  ////////////////////////////////////////////////////////////////////////////

  const [state, setState] = useState([])
  const [items, setItems] = useState()
  const [cssclass,setCssClass]=useState('')
  const [cssclassone,setCssClassOne]=useState('')
  useEffect(() => {
    window.scrollTo(0, 0)
    if(JSON.parse(localStorage.getItem('user')).email=='admin@test.com' ){
      setCssClass('md:ml-[251px] md:-mt-[620px] md:overflow-y-scroll md:max-h-screen')
    
      setCssClassOne('md:fixed md:z-10 md:!mt-[-85px] md:!w-[1040px]')
   
      
    }
    getProducts()
  }, [])
  async function getProducts() {
    await fetch("http://localhost:4000/guide-list", {
      headers: {
        authorization: "bearer " + JSON.parse(localStorage.getItem('token'))
      }
    }).then(async (resp) => {
      await resp.json().then((result) => {
        console.log(result)
        // console.log(result.map((i)=>i.name))
        setState(result)
      })
    })
  }
  function search(key) {
    if (key) {
      fetch('http://localhost:4000/searchGuide/' + key).then((resp) => resp.json().then((result) => {
        console.log(result)
        setState(result)
      }))
    }
    else {
      getProducts()
    }

  }

  function deleteProducts(id) {
  
      JSON.parse(localStorage.getItem('user')).email!=='admin@test.com' && JSON.parse(localStorage.getItem('user')).password!=='admin1234' && navigate('/')
    
    fetch("http://localhost:4000/guide-list/" + id, {
      method: 'delete'

    }).then(async (resp) => {
      resp.json().then((result) => {
        // console.log(result.map((i)=>i.name))
        console.log(result)
        if (result) {

          getProducts()
        }
        else {
          alert("no guides available")
        }

      })
    })
  }



  return (
    <div className={`SearchPage ${cssclass} `}>
      <div className="searchPage__info">
        <input type="text" placeholder='Search Guides' className={`search-product-box marginLeft-9  ${cssclassone}`}  onChange={(event) => { search(event.target.value.toLowerCase()) }} />

        
        {/* <button className={`border rounded-xl p-2   hover:text-white hover:bg-secondarycolor  ${recommended? 'bg-secondarycolor text-white' : 'bg-primarycolor'}`} onClick={handleClickRecommended} >Recommended</button>
        <button className={`border rounded-xl p-2   hover:text-white hover:bg-secondarycolor  ${highRated? 'bg-secondarycolor text-white' : 'bg-primarycolor'}`}  onClick={handleClickHighRated}>High rated</button>
        <button className={`border rounded-xl p-2   hover:text-white hover:bg-secondarycolor  ${lowPrice? 'bg-secondarycolor text-white' : 'bg-primarycolor'}`} onClick={handleClickLowPrice}>Low Price</button> */}
      </div>
      {
        state.length > 0 ? state.map((item, i) =>

          <div className="flex" >
            <Link to={'/guidebooking/' + item._id}>
              <SearchResult
                img={item.img}
                location={item.name}
                title={item.price}
                description={item.perk}
                star={4.73}
                price={"PKR " + item.cost + "  "}
                total=""

              />
            </Link>

            <div className="">
           
           {JSON.parse(localStorage.getItem('user')).email=='admin@test.com' && JSON.parse(localStorage.getItem('user')).password=='admin1234' && <Link to={"/updateGuide/" + item._id} className="mr-[6px]"><FontAwesomeIcon icon={faPenToSquare} color='orange' /></Link>}
            
            {JSON.parse(localStorage.getItem('user')).email=='admin@test.com' && JSON.parse(localStorage.getItem('user')).password=='admin1234' &&<FontAwesomeIcon icon={faTrash} color='red' onClick={() => deleteProducts(item._id)} className='  ' />}
            </div>
          </div>

        ) : <div className="h1 ml-[35px]">No Guides found</div>
      }

    </div>
  );
}

export default SearchPage;
