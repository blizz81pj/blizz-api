create table beer_net.beer_grain
(
    beer_grain_id     int unsigned auto_increment,
    name              varchar(50)                        not null,
    manufacturer      varchar(50)                        null,
    lovibond          int                                null,
    potential_gravity decimal(10, 3)                     null,
    row_created       datetime default CURRENT_TIMESTAMP null,
    row_modified      datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    primary key (beer_grain_id, name)
);