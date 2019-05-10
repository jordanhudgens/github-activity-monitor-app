import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAt,
  faSave,
  faWindowClose,
  faKey,
  faEdit,
  faTrash,
  faSpinner,
  faSignInAlt,
  faChalkboardTeacher,
  faCodeBranch,
  faComments,
  faAngleRight,
  faExclamationCircle,
  faSignOutAlt,
  faCaretSquareRight,
  faCalendarAlt,
  faPlusSquare,
  faFilter,
  faLocationArrow,
  faExternalLinkAlt,
  faUserTimes,
  faCalendarCheck,
  faTasks
} from "@fortawesome/free-solid-svg-icons";

const Icons = () => {
  return library.add(
    faAt,
    faSave,
    faWindowClose,
    faKey,
    faTrash,
    faEdit,
    faSpinner,
    faSignInAlt,
    faChalkboardTeacher,
    faCodeBranch,
    faComments,
    faAngleRight,
    faExclamationCircle,
    faSignOutAlt,
    faCaretSquareRight,
    faCalendarAlt,
    faPlusSquare,
    faFilter,
    faLocationArrow,
    faExternalLinkAlt,
    faUserTimes,
    faCalendarCheck,
    faTasks
  );
};

export default Icons;
