-- 사용자 테이블
CREATE TABLE user (
  uuid BINARY(16) PRIMARY KEY,
  point INT
);

CREATE TABLE user_queue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_uuid BINARY(16),
  status ENUM("ACTIVE", "EXPIRED", "WAITING") DEFAULT 'WAITING',
  created_at DATETIME
);

CREATE TABLE user_point_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_uuid BINARY(16),
  amount INT,
  transactionType ENUM("CHARGE", "USE") DEFAULT "CHARGE",
  created_at DATETIME
);

-- 콘서트 테이블
CREATE TABLE concert (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(45)
);

CREATE TABLE performance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  concert_id INT,
  maximum_capacity INT,
  start_at DATETIME,
  ticketing_start_at DATETIME,
  ticketing_end_at DATETIME
);

CREATE TABLE seat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  performance_id INT,
  seat_no INT,
  price INT
);

-- 예약 테이블
CREATE TABLE reservation_ticket (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_uuid BINARY(16),
  seat_id INT,
  is_finish TINYINT,
  created_at DATETIME
);

-- 결제 테이블
CREATE TABLE order_ticket (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_ticket_id INT,
  step INT,
  is_finish TINYINT,
  concert_name VARCHAR(45),
  seat_no INT,
  price INT,
  created_at DATETIME
);