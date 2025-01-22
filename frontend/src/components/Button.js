const Button = ({type, onClick, text}) => {

  return (
    <button type={type} onClick={onClick} className="text-lg p-2 mt-4 w-28 rounded-2xl main-btn">
      {text}
    </button>
  )
}

export default Button;
