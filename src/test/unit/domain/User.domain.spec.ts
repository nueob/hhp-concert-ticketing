import { User } from "../../../domain/User.domain";
import { WaitingQueue } from "../../../domain/WaitingQueue.domain";
import { WaitingQueueStatusEnum } from "../../../enum/WaitingQueueStatus.enum";

describe("User domain unit", () => {
  describe("isWaiting: 발급 받은 토큰이 대기 중인지 체크한다.", () => {
    test("발급 받은 토큰이 대기 중일 경우 true를 반환한다.", () => {
      //given
      const user = new User(
        "0001",
        1000,
        new WaitingQueue(1, "0001", WaitingQueueStatusEnum.대기, new Date()),
      );
      //when
      const response = user.isWaiting();
      //then
      expect(response).toBeTruthy();
    });
    test("발급 받은 토큰이 활성화 일 경우 false를 반환한다.", () => {
      //given
      const user = new User(
        "0001",
        1000,
        new WaitingQueue(1, "0001", WaitingQueueStatusEnum.활성화, new Date()),
      );
      //when
      const response = user.isWaiting();
      //then
      expect(response).toBeFalsy();
    });
    test("발급 받은 토큰이 만료 일 경우 false를 반환한다.", () => {
      //given
      const user = new User(
        "0001",
        1000,
        new WaitingQueue(1, "0001", WaitingQueueStatusEnum.만료, new Date()),
      );
      //when
      const response = user.isWaiting();
      //then
      expect(response).toBeFalsy();
    });
  });
  describe("isActive: 발급 받은 토큰이 활성화인지 체크한다.", () => {
    test("발급 받은 토큰이 활성화 일 경우 true를 반환한다.", () => {
      //given
      const user = new User(
        "0001",
        1000,
        new WaitingQueue(1, "0001", WaitingQueueStatusEnum.활성화, new Date()),
      );
      //when
      const response = user.isActive();
      //then
      expect(response).toBeTruthy();
    });
    test("발급 받은 토큰이 대기 중일 경우 false를 반환한다.", () => {
      //given
      const user = new User(
        "0001",
        1000,
        new WaitingQueue(1, "0001", WaitingQueueStatusEnum.대기, new Date()),
      );
      //when
      const response = user.isActive();
      //then
      expect(response).toBeFalsy();
    });
    test("발급 받은 토큰이 만료 일 경우 false를 반환한다.", () => {
      //given
      const user = new User(
        "0001",
        1000,
        new WaitingQueue(1, "0001", WaitingQueueStatusEnum.만료, new Date()),
      );
      //when
      const response = user.isActive();
      //then
      expect(response).toBeFalsy();
    });
  });
});
