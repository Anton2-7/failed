const WinnerContact = ({ winner, onClick }) => {
  const getContactInfo = () => {
    if (winner.email) {
      return { type: "Email", value: winner.email };
    }
    if (winner.phone) {
      return { type: "Телефон", value: winner.phone };
    }
    if (winner.tg_id) {
      return { type: "Telegram", value: winner.tg_id };
    }
    if(winner.vk_id){
        return {type:"VK",value:winner.vk_id}
    }
    return null;
  };

  const contact = getContactInfo();

  return (
    <div className="flex flex-col">
      {contact && (
        <span
          className="text-blue-600 hover:text-blue-800 cursor-pointer"
          onClick={onClick}
        >
          {contact.type}: {contact.value}
        </span>
      )}
      <span className="text-gray-900">— {winner.prize_name}</span>
    </div>
  );
};


export default WinnerContact;