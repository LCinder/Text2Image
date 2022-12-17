
import styles from "../styles/styles.css"
import html2canvas from "html2canvas";
import downloadjs from "downloadjs";
import {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate, faArrowDown, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import * as dotenv from 'dotenv';

const App = () => {

    const [text, setText] = useState("");
    const [query, setQuery] = useState("nature wallpapers");
    const [imageURL, setImageURL] = useState("");
    const [images, setImages] = useState([]);
    const [isImage, setIsImage] = useState(false);
    const [hide, setHide] = useState(true);
    const env = dotenv.config();

    const random = Math.floor(Math.random() * 100);
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.API_KEY}&cx=${process.env.CLIENT_ID}&search_type=image&rights=cc_publicdomain&start=${random}&q=${query}`

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                let allImages = [];
                console.log(url)
                console.log(data)

                data.items.forEach((item) => {
                    allImages.push(item.link)
                })

                const imageRandom = Math.floor(Math.random() * allImages.length);
                setImages(allImages);
                setImageURL(images[imageRandom]);
                setIsImage(true)
            })
            .catch(e => {
                console.log(e)
                setImages([]);
                setImageURL("");
                setIsImage(true)
            })
    }, [query])

    const download = () => {
        html2canvas(document.getElementById("container"), {useCORS: true, scale: 10})
        .then((element) => {
            const image = element.toDataURL("image/jpg", 1.0);
            downloadjs(image);
        });
    }

    const showInput = () => {
        setHide(!hide)
    }

    const reload = () => {
        const imageRandom = images[Math.floor(Math.random() * images.length)];
        setImageURL(imageRandom);
    }

    return (
        !isImage ? <div></div> :
            <div className="card">
                <div className="container" id="container">
                    <img src={imageURL}/>
                    <h1>{text}</h1>
                </div>
                <div className="container-2">
                    <input type="text" onInput={(e) => setText(e.target.value)}/>
                    <button onClick={reload}><FontAwesomeIcon icon={faRotate} className={"icon"}/></button>
                    <button onClick={download}><FontAwesomeIcon icon={faArrowDown} className={"icon"}/></button>
                    <button onClick={showInput}><FontAwesomeIcon icon={faEyeSlash} className={"icon"}/></button>
                    {
                        !hide &&
                        <div>
                            <input type="text" placeholder={"New image url..."} onInput={(e) => setImageURL(e.target.value)}/>
                            <input type="text" placeholder={"New query..."} onInput={(e) => setQuery(e.target.value)}/>
                        </div>
                    }
                </div>
            </div>
    )
}

export default App;