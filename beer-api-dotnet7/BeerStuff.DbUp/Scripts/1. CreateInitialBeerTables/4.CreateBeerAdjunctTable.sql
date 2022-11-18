create table beer_net.beer_adjunct
(
    beer_adjunct_id  int unsigned auto_increment
        primary key,
    name           varchar(50)                        not null,
    notes          varchar(255)                       null,
    row_created    datetime default CURRENT_TIMESTAMP null,
    row_modified   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);