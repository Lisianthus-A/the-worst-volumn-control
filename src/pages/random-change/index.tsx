import ac from "@/utils/AudioController";

function RandomChange() {
  const handleClick = () => {
    ac.setVolumn((Math.random() * 100) >> 0);
  };

  return <button onClick={handleClick}>Change</button>;
}

export default RandomChange;
