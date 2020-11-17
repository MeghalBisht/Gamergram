import React,{useState,useEffect} from "react";
import Pic from "../../Images/pic.png";
import "../../Styles/Contributors.css";
import { Link } from "react-router-dom";
import contributors from '../Contributors'

export default function Contributors() {
  const [contributorsList, setContributorsList] = useState([]);
  useEffect(() => {
    setContributorsList(contributors);
  }, [])
  return (
    <div>
      <p  className="contributors">Contributors</p>
      <div className="Main">
      {
        contributorsList.map(contributor => {
          return <div className="Sub">
            <img className="Pic" src={contributor.pic} alt={contributor.name} />
            <p>{contributor.name}</p>
            <button type="submit" className="btn waves-effect waves-light">
              <a style={{ color: "#d6efc7" }}
                href={contributor.github}>
                Github account
              </a>
            </button>
            <br></br>
          </div>
        })
      }
      </div>
    </div>
  );
}