import { useEffect, useRef, useState } from 'react'
import './newPrompt.css'
import Upload from '../upload/Upload'
import { IKImage } from 'imagekitio-react'
import model from '../../lib/gemini'

const NewPrompt = () => {
  
  const [img,setImg] = useState({
    isLoading:false,
    error:"",
    dbData:{}
  })
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const add = async ()=>{
    const prompt = "Write a story about a magic backpack.";

    const result = await model.generateContent(prompt); 
    const response = await result.response;
    const text = response.text();
    console.log(text); 
  }
  return (
    <>
    {img.isLoading && <div className="loader">Loading...</div>}
    {img.dbData?.filePath && (
      <IKImage
      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
      path={img.dbData.filePath}
      width="380"
      transformation={[{width:380}]}
    />
    )}
    <div className="endChat" ref={endRef}></div>
    <button onClick={add}>Add</button>
      <form className='newForm'>
        <Upload setImg={setImg}/>
        <input id='file' type="file" multiple={false} hidden/>
        <input type="text" placeholder='Ask me anything...' />
        <button>
          <img src='/arrow.png' alt=''/>
        </button>
      </form>
    </>
  )
}

export default NewPrompt