"""updated_at added into tags file rev

Revision ID: 6baf32fd1303
Revises: 580c4c4b1f70
Create Date: 2025-11-05 11:08:03.066332

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6baf32fd1303'
down_revision: Union[str, Sequence[str], None] = '580c4c4b1f70'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('tags', sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    pass
