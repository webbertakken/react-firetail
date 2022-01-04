import DynamicIcon from './DynamicIcon';
import styles from './Spinner.module.scss';

interface Props {}

function Spinner({}: Props): JSX.Element {
  return <DynamicIcon icon="VscLoading" className={styles.spin} />;
}

export default Spinner;
