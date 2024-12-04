import { Badge, Button } from "@nextui-org/react";
import { NotificationIcon } from "../../assets/NotificationIcon";

const NotificationDropdown = () => {
  return (
    <Badge content="12+" shape="circle" color="secondary">
      <Button
        radius="full"
        isIconOnly
        aria-label="more than 99 notifications"
        variant="light"
      >
        <NotificationIcon size={24} />
      </Button>
    </Badge>
  );
};

export default NotificationDropdown;
