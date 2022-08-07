drop database if exists centrosdb;
create database centrosdb;
use centrosdb;

create table house
(
    name    varchar(36) primary key,
    color   varchar(36) unique not null,
    manager varchar(16)
);

create table user
(
    user_id         varchar(16) primary key,
    user_type       enum ('STUDENT', 'COUNSELLOR', 'SYSTEM') not null,
    name            varchar(127)                   not null,
    email           varchar(255)                   not null,
    graduation_year int,
    house           varchar(36),
    mentor_group    char(6),
    constraint FK_U_HO foreign key (house) references house (name)
);

alter table house
    add constraint FK_H_MG foreign key (manager) references user (user_id) on delete set null on update cascade;

create table subject
(
    code char(2) primary key,
    name char(64) not null
);

create table major
(
    user_id varchar(16),
    code    char(2),
    primary key (user_id, code),
    constraint FK_MAJ_U foreign key (user_id) references user (user_id) on delete cascade,
    constraint FK_MAJ_C foreign key (code) references subject (code) on delete cascade
);

create table honour
(
    user_id varchar(16),
    code    char(2),
    primary key (user_id, code),
    constraint FK_HON_U foreign key (user_id) references user (user_id) on delete cascade,
    constraint FK_HON_C foreign key (code) references subject (code) on delete cascade
);

create table document
(
    owner_id         varchar(16),
    document_id      varchar(36), # uuid
        file_name        varchar(255)                          not null,
    file_type        varchar(24)                           not null,
    # additional column that will be removed in future
        link             varchar(255)                          not null,
    last_access_time time                                  not null,
    last_access_date date                                  not null,
    document_type    enum ('DOCUMENT', 'GUIDE', 'MINUTES') not null,
    primary key (owner_id, document_id),
    constraint foreign key (owner_id) references user (user_id) on delete cascade
);

create table review
(
    review_id     varchar(36) primary key,
    status        enum ('PENDING', 'REVIEWED', 'ERROR') not null,
    request_date  date                                  not null,
    request_time  time                                  not null,
    document_id   varchar(36),
    owner_id      varchar(16),
    counsellor_id varchar(16),

    constraint FK_S_DOC foreign key (owner_id, document_id) references document (owner_id, document_id) on delete cascade on update cascade,
    constraint FK_S_CID foreign key (counsellor_id) references user (user_id) on delete cascade
);

create table category
(
    name varchar(127) primary key
);

create table guide
(
    owner_id    varchar(16),
    document_id varchar(36),
    category    varchar(127) not null,
    title       varchar(255) not null,
    description text         not null,
    image_link  varchar(255) not null,
    primary key (owner_id, document_id),
    constraint FK_G_ID foreign key (owner_id, document_id) references document (owner_id, document_id) on delete cascade on update cascade,
    constraint FK_CAT_ID foreign key (category) references category (name)
);

create table meeting
(
    meeting_id     int primary key auto_increment,
    follow_up      int,
    student_id     varchar(16),
    counsellor_id  varchar(16),
    meeting_status enum ('PENDING', 'SCHEDULED', 'CANCELLED', 'COMPLETED') not null,
    description    varchar(255),
    venue          varchar(127),
    date           date                                                    not null,
    start_time     time                                                    not null,
    end_time       time                                                    not null,
    minutes_id     varchar(36),
    minutes_owner  varchar(16),
    constraint FK_M_FOL foreign key (follow_up) references meeting (meeting_id) on delete set null on update cascade,
    constraint FK_M_SID foreign key (student_id) references user (user_id) on delete cascade,
    constraint FK_M_CID foreign key (counsellor_id) references user (user_id) on delete cascade,
    constraint FK_M_MIN foreign key (minutes_owner, minutes_id) references document (owner_id, document_id) on delete cascade on update cascade
);

create table cancelled_meeting
(
    meeting_id int primary key,
    reason     varchar(255),
    cancelled_by varchar(16) not null,
    constraint FK_C_UID foreign key (cancelled_by) references user (user_id) on delete cascade on update cascade,
    constraint FK_C_MID foreign key (meeting_id) references meeting (meeting_id) on delete cascade on update cascade
);

create table university
(
    name           varchar(127) primary key,
    enrollment     int,
    country        varchar(127) not null,
    state          varchar(127),
    website        varchar(255),
    image_link     varchar(255),
    app_start_date date,
    app_end_date   date
);

create table course
(
    uni_name    varchar(127),
    title       varchar(127),
    faculty     varchar(127),
    description text,
    tuition_fee decimal(9, 2),
    duration    tinyint,
    image_link  varchar(255),
    primary key (uni_name, title),
    constraint FK_C_UN foreign key (uni_name) references university (name)
);

create table apply
(
    user_id      varchar(16),
    uni_name     varchar(127),
    course_title varchar(127),
    outcome      enum ('ACCEPTED', 'REJECTED', 'WAITLIST', 'PENDING') not null,
    primary key (user_id, uni_name, course_title),
    constraint FK_A_UID foreign key (user_id) references user (user_id),
    constraint FK_A_CO foreign key (uni_name, course_title) references course (uni_name, title)
);

drop procedure if exists hasUserEntry;
drop procedure if exists requestMeeting;
drop procedure if exists acceptMeeting;
drop procedure if exists completeMeeting;
drop procedure if exists cancelMeeting;
drop procedure if exists addMajor;
drop procedure if exists addHonour;
drop procedure if exists completeReview;

delimiter //
create procedure hasUserEntry(in uid varchar(16), out res bool)
begin
    select count(*)
    into res
    from user
    where user_id = uid;
end//

create procedure requestMeeting(in student_id varchar(16), in description varchar(255), in date date,
                                in start_time time, in end_time time)
begin
insert into meeting (student_id, meeting_status, description, date, start_time, end_time)
values (student_id, 'PENDING', description, date, start_time, end_time);
end//

create procedure acceptMeeting(in m_id int, in c_id varchar(16), in ven varchar(127))
begin
update meeting
set meeting.meeting_status = 'SCHEDULED',
    meeting.counsellor_id  = c_id,
    meeting.venue          = ven
where meeting.meeting_id = m_id;
end//

create procedure completeMeeting(in m_id int)
begin
update meeting set meeting_status = 'COMPLETED' where meeting_id = m_id;
set @doc_id := UUID();
select student_id from meeting where meeting_id = m_id into @s_id;
insert into document value (@s_id, @doc_id, concat('Minutes for Meeting #', m_id), 'docx',
                                'test',
                                current_time, current_date, 'MINUTES');
update meeting set minutes_id = @doc_id where meeting_id = m_id;
update meeting set minutes_owner = @s_id where meeting_id = m_id;
end//


create procedure cancelMeeting(in m_id int, in reason varchar(255), in cancelled_by varchar(16))
begin
insert into cancelled_meeting value (m_id, reason, cancelled_by);
update meeting set meeting_status = 'CANCELLED' where meeting_id = m_id;
end//


create procedure addMajor(in student_id varchar(16), in subject_name char(64))
begin
select code into @code from subject where name = subject_name;
insert into major value (student_id, @code);
end//


create procedure addHonour(in student_id varchar(16), in subject_name char(64))
begin
select code into @code from subject where name = subject_name;
insert into honour value (student_id, @code);
end//

create procedure completeReview(in c_id varchar(16), in r_id varchar(36))
begin
update review set status = 'REVIEWED' where review_id = r_id;
update review set counsellor_id = c_id where review_id = r_id;
end//

delimiter ;

drop trigger if exists guide_doctype_update_trigger;
create trigger guide_doctype_update_trigger
    after insert
    on guide
    for each row
    update document
    set document.document_type = 'GUIDE'
    where new.document_id = document.document_id;

/* Views for convenient queries */
drop view if exists guides_view;
create view guides_view as
select document_id, category, title, description, image_link, name as 'publisher', link
from guide
         natural join document
         join user on guide.owner_id = user.user_id;

drop view if exists meeting_public_view;
create view meeting_public_view as
select meeting.venue,
       meeting.meeting_id,
       user.name,
       user.email,
       user.user_id as 'student_id',
       meeting_status,
        date,
        start_time,
        end_time
        from meeting,
        user
        where meeting_status <> 'CANCELLED'
        and user.user_id = meeting.student_id;

drop view if exists meeting_user_view;
create view meeting_user_view as
select user.name  as 'counsellor_name',
        user.email as 'counsellor_email',
        user.user_id as 'counsellor_id',
        student_id,
       meeting.meeting_id,
       reason,
       meeting_status,
       description,
       venue,
        date,
        start_time,
        end_time
        from meeting
        left join user on user.user_id = meeting.counsellor_id
        left join cancelled_meeting cm on meeting.meeting_id = cm.meeting_id;

drop view if exists meeting_pending_view;
create view meeting_pending_view as
select meeting_id, user.name, user.email, description, date, start_time, end_time
        from meeting,
        user
        where meeting.student_id = user.user_id
        and meeting_status = 'PENDING';

drop view if exists student_review_view;
create view student_review_view as
select document.owner_id,
       review_id,
       status,
       request_date,
       request_time,
       file_name,
       file_type,
       link
from review
         natural join document;

drop view if exists counsellor_review_view;
create view counsellor_review_view as
select document.owner_id,
       user.name,
       user.email,
       review_id,
       status,
       request_date,
       request_time,
       file_name,
       file_type,
       link
from review
         natural join document
         join user on document.owner_id = user.user_id
where review.status = 'PENDING';

/* Events */

drop event if exists cancel_past_meetings_event;
create event cancel_past_meetings_event
    on schedule every 1 day
        starts current_date
    do
    insert into cancelled_meeting
select meeting_id, 'system cancellation', 'system'
from meeting
where meeting.meeting_status = 'PENDING'
  and meeting.date < current_date;

INSERT INTO user VALUES ('system', 'SYSTEM', 'Centros', 'centros@nushigh.edu.sg', NULL, NULL, NULL);
INSERT INTO user VALUES ('nhsapu','COUNSELLOR','ALLAN PATRICK','nhsapu@nushigh.edu.sg',NULL,NULL,NULL);
INSERT INTO user VALUES ('nhscsp','COUNSELLOR','CHEW SHUHUI PHYLLISCIA','nhscsp@nus.edu.sg',NULL,NULL,NULL);
INSERT INTO user VALUES ('c.west6','COUNSELLOR','CHRISTOPHER ANDREW WEST','c.west6@nushigh.edu.sg',NULL,NULL,NULL);

insert into house values ('NOBEL', 'GREEN', 'c.west6');
insert into house values ('FIBONACCI', 'RED', 'c.west6');
insert into house values ('FLEMING', 'BLUE', 'nhsapu');
insert into house values ('FARADAY', 'YELLOW', 'nhsapu');

insert into subject value ('PC', 'Physics');
insert into subject value ('CS', 'Computing Studies');
insert into subject value ('BL', 'Biology');
insert into subject value ('CM', 'Chemistry');
insert into subject value ('MA', 'Mathematics');
insert into subject value ('EN', 'English Literature');
insert into subject value ('AR', 'Art');
insert into subject value ('HY', 'History');
insert into subject value ('GE', 'Geography');
insert into subject value ('MU', 'Music');
insert into subject value ('EL', 'English');
insert into subject value ('CH', 'Chinese');
insert into subject value ('TM', 'Tamil');
insert into subject value ('EC', 'Economics');
