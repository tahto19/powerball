import { ReactNode } from "react";
import ReactDOM from "react-dom";
interface PopperContainerProps {
  children: ReactNode;
}

const PopperContainer: React.FC<PopperContainerProps> = ({ children }) => {
  const portalDiv = document.getElementById("datepicker-portal");
  if (!portalDiv) return <>{children}</>;

  return ReactDOM.createPortal(children, portalDiv);
};
export default PopperContainer;
