import React from 'react'
import { Link } from 'react-router-dom';

const MyProperties = () => {
  return (
    <div className='mt-16 pb-16 max-w-7xl mx-auto'>
      <div className='flex flex-row justify-between lg:pr-32'>
            <div className='flex flex-col items-end w-max mb-8 px-4 lg:px-0'>
             <p className='text-2xl font-medium uppercase'>My Properties</p>
             <div className='w-16 h-0.5 bg-primary rounded-full'>
             </div>
        </div>
         <div className="relative pr-4 lg:pr-0">
        {/* <Link
            to={'/'}
            className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-primary text-primary-dull hover:text-white inline-block"
          >
            <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
            <span className="relative z-10 group-hover:text-white">
              Continue Shopping
            </span>
          </Link> */}
    </div>  
      </div>
        
       {/* {myOrders.map((order, index) => (
  <div key={index} className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-6xl shadow-xl hover:shadow">
    <p className="flex justify-between md:items-center text-gray-600 md:font-medium max-md:flex-col">
      <span>OrderId : {order.orderId}</span>
      <span>Payment : {order.paymentType}</span>
      <span className='text-red-400'>Status : {order.status || "Order Placed"}</span>
    </p>

    {order.platters.map((item, index) => (
      <div
        key={index}
        className={`relative bg-white text-gray-500/70 
          ${order.platters.length !== index + 1 && "border-b"} 
          border-gray-300 flex flex-col md:flex-row md:items-start justify-between py-4 md:gap-3 w-full max-w-4xl`}
      >
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-primary/10 p-1 rounded-lg">
            <img
              src={item.path || "https://via.placeholder.com/100"}
              alt={item.name}
              className="w-16 h-16"
            />
          </div>
          <div className="ml-4 text-gray-800 w-[200px]">
            <h2 className="text-xl font-medium ">Details</h2>
            <p>Occassion : {item?.details?.occasion || "Not Selected"}</p>
            <p>Price/platter : {currency} {item?.details?.totalPrice || "NA"}</p>
            <p>Guests : {item?.details?.guests || "1"}</p>
            <p>Date : { item?.details?.date }</p>
            <p className="text-gray-900 text-md font-medium">
              Amount : {currency} {item?.offerPrice}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0 text-gray-800 ">
          <h2 className="text-xl font-medium ">{item.name}</h2>

{item.category === "bulk-delivery" ? (
  <div>
    {item.productDetails &&
      Object.entries(item.productDetails).map(([name, detail], idx) => (
        <p key={idx} className="text-md">
          <span className=" text-purple-800"> {name} </span> ⟶ {detail.qty} {detail.unit}
        </p>
      ))}
  </div>
) : (
  <div>
    {item?.name === 'Snack Box A'  && <p className='text-purple-800'>Tissue paper and Sauce Pouches</p>} 
    {item?.name === 'Snack Box B' && <p className='text-purple-800'>Tissue paper and Sauce Pouches</p>} 
    
    
    {item.selectedOptions && typeof item.selectedOptions === "object" ? (
  Object.entries(item.selectedOptions)
    .filter(([_, value]) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) {
        return value.some(v => v !== null && v !== "" && (typeof v !== "object" || Object.values(v).some(x => x)));
      }
      if (typeof value === "object") {
        return Object.values(value).some(v => v !== null && v !== "");
      }
      return value !== "";
    })
    .map(([key, value], idx) => {
      let displayValue = "";

      if (Array.isArray(value)) {
        displayValue = value
          .filter(v => v !== null && v !== "")
          .map(v => {
            if (typeof v === "object" && v !== null) {
              const objVal = Object.values(v).filter(x => x !== null && x !== "").join(", ");
              return objVal || null;
            }
            return v;
          })
          .filter(Boolean) 
          .join(", ");
      } else if (typeof value === "object" && value !== null) {
        displayValue = Object.values(value)
          .filter(v => v !== null && v !== "")
          .join(", ");
      } else {
        displayValue = value;
      }

      if (!displayValue) return null;

      return (
        <p key={key + idx}>
          <span className="text-purple-800">{key} ⟶ </span> {displayValue}
        </p>
      );
    })
) : typeof item.selectedOptions === "string" && item.selectedOptions.trim() !== "" ? (
  <p>{item.selectedOptions}</p>
) : null}

  </div>
)}
         
{item.category !== "bulk-delivery" &&
  (!item.selectedOptions || Object.keys(item.selectedOptions).length === 0) &&
  item?.menu?.length > 0 &&
  item.menu.map((menuItem, idx) => (
    <p key={idx}>{menuItem}</p>
  ))
}
        </div>
        <div className="text-sm md:text-base text-black/60">
          <p className="text-black/80">
            {order.address.firstName} {order.address.lastName}
          </p>
          <p>
            {order.address.address}, {order.address.city}
          </p>
          <p>
            {order.address.state}, India
          </p>
          <p>{order.address.phone}</p>
          <div><h2 className=" text-purple-900 font-semibold pt-2"> Additional Note   </h2><p>{order.note ? (order.note ): ("Not Mentioned")}  </p></div>
        </div>
      </div>
    ))}
    {order.platters.length === 0 && 
      <div
        className={`relative bg-white text-gray-500/70 
          border-gray-300 flex flex-col md:flex-row md:items-start justify-between py-4 md:gap-3 w-full max-w-4xl`}
      >
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-primary/10 p-1 rounded-lg">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/042/600/495/small_2x/ai-generated-a-still-life-of-a-street-food-cart-with-snacks-such-as-samosas-pakoras-and-chaat-free-photo.jpg"
              alt='item'
              className="w-16 h-16"
            />
          </div>
          <div className="ml-4 text-gray-800 w-[200px]">
            <h2 className="text-xl font-medium ">Details</h2>
            
            {order?.items?.map((item, index) => {
            const matchedProduct = saleProducts.find(p => p._id === item.product);

            return (
              <div key={index}>
                <div>
                  {matchedProduct?.name} : <span>{item.quantity} Qty</span>
                </div>
              </div>
            );
          })}
          <p className="text-gray-900 text-md font-medium">
              Amount : {currency} {order?.storeamount}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0 text-gray-800 ">
          <h2 className="text-xl font-medium ">{order.name}</h2>
        </div>
        <div className="text-sm md:text-base text-black/60">
          <p className="text-black/80">
            {order.address.firstName} {order.address.lastName}
          </p>
          <p>
            {order.address.address}, {order.address.city}
          </p>
          <p>
            {order.address.state}, India
          </p>
          <p>{order.address.phone}</p>
          <div><h2 className=" text-purple-900 font-semibold pt-2"> Additional Note   </h2><p>{order.note ? (order.note ): ("Not Mentioned")}  </p></div>
        </div>
      </div>
    }
    <div className='flex justify-between'>
      <div className=''>

          <DownloadInvoiceButton order={order} fileName={`Invoice_${order.orderId}.pdf`} />
      <div style={{ display: "none" }}>
      </div>
    </div>  
      <div className=''>
        <Link
            to={'tel:+919096201044'}
            className="relative px-4 py-1 rounded-full overflow-hidden group border-2 border-primary text-primary-dull hover:text-white inline-block"
          >
            <span className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
            <span className="relative z-10 group-hover:text-white">
              Call Us
            </span>
          </Link>
    </div>  
    </div>
  </div>
))} */}
{/* <div className='block lg:hidden'><FooterBar/></div> */}
    </div>
  )
}

export default MyProperties