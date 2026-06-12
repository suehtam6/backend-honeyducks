create database db_doceria;

use db_doceria;

create table tbl_status(
	id int not null auto_increment primary key,
    status varchar(15) not null
);

create table tbl_categoria(
	id int not null auto_increment primary key,
    categoria varchar(30) not null
);

create table tbl_sabor(
	id int not null auto_increment primary key,
    sabor varchar(20) not null
);

create table tbl_doce(
	id int not null auto_increment primary key,
    nome varchar(30) not null,
    imagem varchar(255) not null,
    valor decimal(7,2) not null,
    descricao text not null,
    avaliacao decimal(3,2) not null,
    qtde int not null,
    id_categoria int not null,
    id_status int not null,
        
    constraint FK_CATEGORIA_DOCE
    foreign key (id_categoria)
    references tbl_categoria(id),
    
    constraint FK_STATUS_DOCE
    foreign key (id_status)
    references tbl_status(id)
    
);

create table tbl_doce_sabor(
	id int not null auto_increment primary key,
    id_doce int not null,
    id_sabor int not null,
    
    constraint FK_DOCE_DOCESABOR
    foreign key (id_doce)
    references tbl_doce(id),
    
    constraint FK_SABOR_DOCESABOR
    foreign key (id_sabor)
    references tbl_sabor(id)
    
);

#------------------------------------------------------#

create table tbl_usuario(
	id int not null auto_increment primary key,
    nome varchar(80) not null,
    email varchar(255) not null,
    cpf varchar(18) not null,
    senha varchar(512) not null

);

#------------------------------------------------------#


# drop database db_doceria;