import { ThreeDots } from "react-loader-spinner";

const LoadingSpinner = () => {
  return (
    <ThreeDots
      visible={true}
      height="40"
      width="40"
      color="#FACC15"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export default LoadingSpinner;
