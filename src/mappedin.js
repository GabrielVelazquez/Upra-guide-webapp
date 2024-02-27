import React from 'react';
import "./mappedin.css";
import "./Home.css";

const mappedin = () => {
    return (
        <div className="mappedincss">
            <iframe 
                src="https://app.mappedin.com/map/65cf9e6ca391db7b4e9209ec?embedded=true" //link
                href="https://www.mappedin.com/" 
                title="Salones AC"
                width="100%"  
                height="620" //height="650"   

                //style={{ border: 1, marginTop:85, background:"red" , overflow: "hidden"}}              
                /*ORIGINAL
                        //allowFullScreen=""
                        //aria-hidden="false"
                         //tabIndex="0"
                       //frameborder="0"
                         //width="600"
                         //height="450"
                         //border="0"
                ORIGINAL*/
            ></iframe>
            
        </div>
    );
};
export default mappedin;